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

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';

export type RegionDocument = HydratedDocument<Region>;

@Schema()
export class Region {
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'DataSpace' })
  dataSpace_id: number;

  @Prop()
  region_code: string;

  @Prop()
  region_name: string;

  @Prop()
  created_at: Date;

  @Prop()
  last_updated_at: Date;
}

export const RegionSchema = SchemaFactory.createForClass(Region);