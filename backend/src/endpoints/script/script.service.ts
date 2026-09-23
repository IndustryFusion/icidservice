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

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { countries } from "countries-list";
import { Company } from 'src/schemas/company.schema';
import { Country } from 'src/schemas/country.schema';
import { Asset } from 'src/schemas/asset.schema';
import { DataSpace } from 'src/schemas/dataSpace.schema';
import { GateWay } from 'src/schemas/gateway.schema';
import { ObjectType } from 'src/schemas/objectType.schema';
import { ObjectSubType } from 'src/schemas/objectSubType.schema';
import { Region } from 'src/schemas/region.schema';
import { Server } from 'src/schemas/server.schema';
import { Urn } from 'src/schemas/urn.schema';
import { User } from 'src/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import * as moment from 'moment';

@Injectable()
export class ScriptService implements OnModuleInit {
  private readonly logger = new Logger(ScriptService.name);

  constructor(
    @InjectModel(Company.name)
    private companyModel: Model<Company>,
    @InjectModel(Country.name)
    private countryModel: Model<Country>,
    @InjectModel(Asset.name)
    private assetModel: Model<Asset>,
    @InjectModel(DataSpace.name)
    private dataSpaceModel: Model<DataSpace>,
    @InjectModel(GateWay.name)
    private gateWayModel: Model<GateWay>,
    @InjectModel(ObjectType.name)
    private objectTypeModel: Model<ObjectType>,
    @InjectModel(ObjectSubType.name)
    private objectSubTypeModel: Model<ObjectSubType>,
    @InjectModel(Region.name)
    private regionModel: Model<Region>,
    @InjectModel(Server.name)
    private serverModel: Model<Server>,
    @InjectModel(Urn.name)
    private urnModel: Model<Urn>,
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  /**
   * Seed the reference data this service cannot mint without.
   *
   * Every mint validates its object type and sub-type against these rows, so
   * an unseeded database answers "Object Sub Type Code does not exist" for
   * everything. That used to require someone to remember to POST /script on
   * each environment, and a newly added code — LOC/FAC, for instance —
   * silently broke minting everywhere the call had not been repeated.
   *
   * `create()` is written as insert-what-is-missing, so running it on every
   * boot adds new codes and leaves existing rows untouched.
   *
   * Never fatal: a seeding failure must not stop the service from starting.
   * A database that is briefly unreachable at boot would otherwise take the
   * whole service down, and the next restart seeds it anyway. Set
   * ICID_AUTO_SEED=false to opt out.
   */
  async onModuleInit(): Promise<void> {
    if (process.env.ICID_AUTO_SEED === 'false') {
      this.logger.log('Automatic seeding is switched off (ICID_AUTO_SEED=false).');
      return;
    }
    try {
      await this.create();
      this.logger.log('Reference data is present and up to date.');
    } catch (err) {
      this.logger.error(
        `Could not seed reference data: ${err?.message ?? err}. ` +
          'Identifier minting will fail until this is resolved — ' +
          'POST /script once the database is reachable.',
      );
    }
  }

  async create() {
    try {
      // Check if DataSpace already exists
      let dataSpace = await this.dataSpaceModel.findOne({ dataSpace_code: "IFX" });
      
      if (!dataSpace) {
        const dataSpaceData = new this.dataSpaceModel({
          dataSpace_code: "IFX",
          dataSpace_name: "IndustryFusion-X",
          created_at: moment().format(),
          last_updated_at: moment().format()
        });
        dataSpace = await dataSpaceData.save();
      }
  
      // Regions
      let existingRegions = await this.regionModel.find({ dataSpace_id: dataSpace.id });
      if (existingRegions.length === 0) {
        let regionData = [{
          region_code: "EUR",  
          region_name: "Europe",
          dataSpace_id: dataSpace.id,
          created_at: moment().format(),
          last_updated_at: moment().format()
        }, {
          region_code: "NAR",
          region_name: "North America",
          dataSpace_id: dataSpace.id,
          created_at: moment().format(),
          last_updated_at: moment().format()
        }, {
          region_code: "SAR",
          region_name: "South America",
          dataSpace_id: dataSpace.id,
          created_at: moment().format(),
          last_updated_at: moment().format()
        }, {
          region_code: "ASA",
          region_name: "Asia",
          dataSpace_id: dataSpace.id,
          created_at: moment().format(),
          last_updated_at: moment().format()
        }, {
          region_code: "AFR",
          region_name: "Africa",
          dataSpace_id: dataSpace.id,
          created_at: moment().format(),
          last_updated_at: moment().format()
        }, {
          region_code: "AUS",
          region_name: "Australia",
          dataSpace_id: dataSpace.id,
          created_at: moment().format(),
          last_updated_at: moment().format()
        }];
        await this.regionModel.insertMany(regionData);
      }
  
      // Countries
      let countryCount = await this.countryModel.countDocuments();
      if (countryCount === 0) {
        const countryData = Object.keys(countries).map(key => ({
          country_code: key,
          country_name: countries[key].name,
          created_at: moment().format(),
          last_updated_at: moment().format()
        }));
        await this.countryModel.insertMany(countryData);
      }
  
      // Object Types
      // LOC covers physical places a company owns — today just factories.
      const objectTypeList = ["HWR", "NLD", "COM", "CON", "LOC"];
      const existingObjectTypes = await this.objectTypeModel.find({ object_type_code: { $in: objectTypeList } });
      const objectTypeData = [
        { object_type_code: "HWR", object_type_name: "Hardware" },
        { object_type_code: "NLD", object_type_name: "NGSI-LD" },
        { object_type_code: "COM", object_type_name: "Company" },
        { object_type_code: "CON", object_type_name: "Contract" },
        { object_type_code: "LOC", object_type_name: "Location" }
      ].filter(type => !existingObjectTypes.some(existingType => existingType.object_type_code === type.object_type_code));
  
      if (objectTypeData.length > 0) {
        const objectTypeRecords = objectTypeData.map(type => ({
          ...type,
          created_at: moment().format(),
          last_updated_at: moment().format()
        }));
        await this.objectTypeModel.insertMany(objectTypeRecords);
      }
  
      // Object Subtypes
      let objectSubTypeData = [
        { object_sub_type_code: "AST", object_sub_type_name: "Asset", object_type_id: "NLD" },
        { object_sub_type_code: "USR", object_sub_type_name: "User", object_type_id: "NLD" },
        { object_sub_type_code: "GTW", object_sub_type_name: "Gateway", object_type_id: "HWR" },
        { object_sub_type_code: "FSV", object_sub_type_name: "Factory Server", object_type_id: "HWR" },
        { object_sub_type_code: "NAP", object_sub_type_name: "Not Applicable", object_type_id: "COM" },
        { object_sub_type_code: "DEF", object_sub_type_name: "Contract definition", object_type_id: "CON" },
        { object_sub_type_code: "BND", object_sub_type_name: "Contract binding", object_type_id: "CON" },
        // A factory site. Distinct from FSV ("Factory Server"), which is the
        // hardware box standing in a factory rather than the place itself.
        { object_sub_type_code: "FAC", object_sub_type_name: "Factory", object_type_id: "LOC" }
      ];
  
      for (let i = 0; i < objectSubTypeData.length; i++) {
        const objectType = await this.objectTypeModel.findOne({ object_type_code: objectSubTypeData[i].object_type_id });
        if (objectType) {
          objectSubTypeData[i].object_type_id = objectType.id;
  
          const existingSubType = await this.objectSubTypeModel.findOne({ object_sub_type_code: objectSubTypeData[i].object_sub_type_code });
          if (!existingSubType) {
            const objectSubTypeValues = new this.objectSubTypeModel({
              ...objectSubTypeData[i],
              created_at: moment().format(),
              last_updated_at: moment().format()
            });
            await objectSubTypeValues.save();
          }
        }
      }
  
      console.log('objectSubTypeData saved successfully');
      return {
        success: true,
        status: 201,
        message: "Data added successfully"
      };
    } catch(err) {
      throw err;
    }
  }

  findAll() {
    return `This action returns all script`;
  }

  findOne(id: number) {
    return `This action returns a #${id} script`;
  }

  update(id: number) {
    return `This action updates a #${id} script`;
  }

  remove(id: number) {
    return `This action removes a #${id} script`;
  }
}
