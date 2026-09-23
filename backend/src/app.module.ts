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

import * as dotenv from 'dotenv';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanySchema, Company } from './schemas/company.schema';
import { CountrySchema, Country } from 'src/schemas/country.schema';
import { AssetSchema, Asset } from 'src/schemas/asset.schema';
import { DataSpaceSchema, DataSpace } from 'src/schemas/dataSpace.schema';
import { GateWaySchema, GateWay } from 'src/schemas/gateway.schema';
import { ObjectTypeSchema, ObjectType } from 'src/schemas/objectType.schema';
import { ObjectSubTypeSchema, ObjectSubType } from 'src/schemas/objectSubType.schema';
import { RegionSchema, Region } from 'src/schemas/region.schema';
import { ServerSchema, Server } from 'src/schemas/server.schema';
import { UrnSchema, Urn } from 'src/schemas/urn.schema';
import { UserSchema, User } from 'src/schemas/user.schema';
import { Contract, ContractSchema } from './schemas/contract.schema';
import { Binding, BindingSchema } from './schemas/binding.schema';
import { ScriptController } from './endpoints/script/script.controller';
import { ScriptService } from './endpoints/script/script.service';
import { AssetController } from './endpoints/asset/asset.controller';
import { AssetService } from './endpoints/asset/asset.service';
import { FactoryController } from './endpoints/factory/factory.controller';
import { FactoryService } from './endpoints/factory/factory.service';
import { Factory, FactorySchema } from './schemas/factory.schema';
import { GatewayController } from './endpoints/gateway/gateway.controller';
import { GatewayService } from './endpoints/gateway/gateway.service';
import { CompanyController } from './endpoints/company/company.controller';
import { CompanyService } from './endpoints/company/company.service';
import { UserController } from './endpoints/user/user.controller';
import { UserService } from './endpoints/user/user.service';
import { CertificateController } from './endpoints/certificate/certificate.controller';
import { CertificateService } from './endpoints/certificate/certificate.service';
import { ContractController } from './endpoints/contract/contract.controller';
import { ContractService } from './endpoints/contract/contract.service';

dotenv.config();
const mongoURI = process.env.MONGO_URL;

@Module({
  imports: [
    MongooseModule.forRoot(mongoURI,{
      readPreference: 'secondaryPreferred' // This allows reads from secondaries if available
    }),
    MongooseModule.forFeature([
      { name: Company.name, schema: CompanySchema },
      { name: Country.name, schema: CountrySchema },
      { name: Asset.name, schema: AssetSchema },
      { name: DataSpace.name, schema: DataSpaceSchema },
      { name: ObjectType.name, schema: ObjectTypeSchema },
      { name: ObjectSubType.name, schema: ObjectSubTypeSchema },
      { name: GateWay.name, schema: GateWaySchema },
      { name: Region.name, schema: RegionSchema },
      { name: Server.name, schema: ServerSchema },
      { name: Urn.name, schema: UrnSchema },
      { name: User.name, schema: UserSchema },
      { name: Contract.name, schema: ContractSchema },
      { name: Binding.name, schema: BindingSchema },
      { name: Factory.name, schema: FactorySchema }
    ]),
  ],
  controllers: [
    AppController,
    ScriptController,
    AssetController,
    GatewayController,
    CompanyController,
    UserController,
    CertificateController,
    ContractController,
    FactoryController
  ],
  providers: [
    AppService,
    ScriptService,
    AssetService,
    GatewayService,
    CompanyService,
    UserService,
    CertificateService,
    ContractService,
    FactoryService
  ],
})
export class AppModule {}
