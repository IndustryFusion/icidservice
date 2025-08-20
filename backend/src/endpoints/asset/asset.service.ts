// 
// Copyright (c) 2024 IB Systems GmbH 
// 
// Licensed under the Apache License, Version 2.0 (the "License"); 
// you may not use this file except in compliance with the License. 
// You may obtain a copy of the License at 
// 
// http://www.apache.org/licenses/LICENSE-2.0 
// 
// Unless required by applicable law or agreed to in writing, software 
// distributed under the License is distributed on an "AS IS" BASIS, 
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
// See the License for the specific language governing permissions and 
// limitations under the License. 
// 

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Urn } from 'src/schemas/urn.schema';
import { Asset } from 'src/schemas/asset.schema';
import { ObjectSubType } from 'src/schemas/objectSubType.schema';
import { ObjectType } from 'src/schemas/objectType.schema';
import { Region } from 'src/schemas/region.schema';
import { v5 as uuidv5, validate as uuidValidate } from 'uuid';
import * as moment from 'moment';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateAssetDto } from './dto/create.dto';

@Injectable()
export class AssetService {
  constructor(
    @InjectModel(Asset.name)
    private assetModel: Model<Asset>,
    @InjectModel(Urn.name)
    private urnModel: Model<Urn>,
    @InjectModel(ObjectSubType.name)
    private objectSubTypeModel: Model<ObjectSubType>,
    @InjectModel(ObjectType.name)
    private ObjectTypeModel: Model<ObjectType>,
    @InjectModel(Region.name)
    private regionModel: Model<Region>
  ) {}
  private readonly ifricId = process.env.IFRIC_NAMESPACE;

  async create(data: CreateAssetDto) {
    try{
      let objectSubTypeResponse = await this.objectSubTypeModel.find({object_sub_type_code: data.object_sub_type_code.toUpperCase()});
      if(objectSubTypeResponse.length > 0){
        let objectTypeData = await this.ObjectTypeModel.findById(objectSubTypeResponse[0].object_type_id);
        if(objectTypeData && objectTypeData.object_type_code == data.object_type_code){
          let response = await this.assetModel.find({machine_serial_number: data.machine_serial_number});
          if(!(response.length > 0)){
            let uuid = uuidv5(`${data.machine_serial_number}-${data.registration_number}`, this.ifricId);
            const regionData = await this.regionModel.find();
            regionData.forEach(value => {
              if(value.region_code.startsWith(data.region_code)) {
                data.region_code = value.region_code;
              }
            })
            let ifricId = `urn:ifric:${data.dataspace_code.toLowerCase()}-${data.region_code.toLowerCase()}-${data.object_type_code.toLowerCase()}-${data.object_sub_type_code.toLowerCase()}-${uuid}`;
            const urnData = new this.urnModel({
              urn: ifricId,
              created_at: moment().format(),
              last_updated_at: moment().format()
            })
            await urnData.save();
            let urnResponse = await this.urnModel.find({urn: ifricId});
            if(urnResponse.length > 0){
              const assetData = new this.assetModel({
                machine_serial_number: data.machine_serial_number,
                urn_id: urnResponse[0].id,
                created_at: moment().format(),
                last_updated_at: moment().format()
              })
              await assetData.save();
              return { status: 201, message: 'Asset created successfully', urn_id: ifricId };
            } else{
              throw new HttpException("Urn ID does not exist", HttpStatus.NOT_FOUND);
            }
          }else{
            throw new HttpException("Machine Serial Number already exists", HttpStatus.CONFLICT);
          }
        }else{
          throw new HttpException("Invalid Object Sub Type Code", HttpStatus.BAD_REQUEST);
        }
      }else{
        throw new HttpException("Object Sub Type Code does not exist", HttpStatus.NOT_FOUND);
      }
    }catch(err){
      if (err instanceof HttpException) {
        throw err;
      } else if(err.response) {
        throw new HttpException(err.response.data.message, err.response.status);
      } else {
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  findAll() {
    return `This action returns all asset`;
  }

  findOne(id: string) {
    return `This action returns a #${id} asset`;
  }

  update(id: string) {
    return `This action updates a #${id} asset`;
  }

  async remove(id: string) {
    try {
      const urnData = await this.urnModel.find({urn: id});
      console.log("urn data ",urnData);
      if(urnData.length) {
        await this.urnModel.deleteOne({urn: id});
        await this.assetModel.deleteOne({urn_id: urnData[0].id});
      }
      return {status: 204, message: "asset id deleted successfully"};
    } catch(err) {
      if (err instanceof HttpException) {
        throw err;
      } else if(err.response) {
        throw new HttpException(err.response.data.message, err.response.status);
      } else {
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
