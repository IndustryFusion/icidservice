//
// Copyright (c) 2024 IB Systems GmbH
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
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
import { Factory } from 'src/schemas/factory.schema';
import { ObjectSubType } from 'src/schemas/objectSubType.schema';
import { ObjectType } from 'src/schemas/objectType.schema';
import { Region } from 'src/schemas/region.schema';
import { v5 as uuidv5 } from 'uuid';
import * as moment from 'moment';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateFactoryDto } from './dto/create.dto';

/**
 * Identifiers for factories — a physical site a company owns and operates.
 *
 * Follows the company/asset services exactly: validate the object sub-type
 * and its parent type, refuse a duplicate natural key, derive a uuidv5 under
 * the service's secret namespace, then save the urn and the domain row.
 *
 * The identifier is derived from the owning company plus a caller-supplied
 * factory key, and from nothing else. In particular the factory's *name* is
 * not an input: uuidv5 is deterministic, so a rename would otherwise produce
 * a different identifier for a factory that is already in circulation.
 */
@Injectable()
export class FactoryService {
  constructor(
    @InjectModel(Factory.name)
    private factoryModel: Model<Factory>,
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

  async create(data: CreateFactoryDto) {
    try{
      let objectSubTypeResponse = await this.objectSubTypeModel.find({object_sub_type_code: data.object_sub_type_code.toUpperCase()});
      if(objectSubTypeResponse.length > 0){
        let objectTypeData = await this.ObjectTypeModel.findById(objectSubTypeResponse[0].object_type_id);
        if(objectTypeData && objectTypeData.object_type_code == data.object_type_code){
          if(!data.owner_company_ifric_id) {
            throw new HttpException("Owner Company IFRIC ID required", HttpStatus.CONFLICT);
          }
          if(!data.factory_key) {
            throw new HttpException("Factory Key required", HttpStatus.CONFLICT);
          }
          // Scoped to the company: two companies may each use the same key
          // for their own factory without colliding.
          let response = await this.factoryModel.find({
            owner_company_ifric_id: data.owner_company_ifric_id,
            factory_key: data.factory_key
          });
          if(!(response.length > 0)){
            let uuid = uuidv5(`${data.owner_company_ifric_id}-${data.factory_key}`, this.ifricId);
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
              const factoryData = new this.factoryModel({
                owner_company_ifric_id: data.owner_company_ifric_id,
                factory_key: data.factory_key,
                urn_id: urnResponse[0].id,
                created_at: moment().format(),
                last_updated_at: moment().format()
              })
              await factoryData.save();
              return { status: 201, message: 'Factory created successfully', urn_id: ifricId };
            } else{
              throw new HttpException("Urn ID does not exist", HttpStatus.NOT_FOUND);
            }
          }else{
            throw new HttpException("Factory already exists for this company", HttpStatus.CONFLICT);
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

  /**
   * Releases an identifier. The caller uses this to compensate when its own
   * write fails after the mint succeeded — the mint cannot take part in the
   * caller's transaction, so it is undone by hand.
   */
  async remove(id: string) {
    try {
      const urnData = await this.urnModel.find({urn: id});
      if(urnData.length) {
        await this.urnModel.deleteOne({urn: id});
        await this.factoryModel.deleteOne({urn_id: urnData[0].id});
      }
      return {status: 204, message: "factory id deleted successfully"};
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
