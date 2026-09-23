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

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';

export type FactoryDocument = HydratedDocument<Factory>;

@Schema()
export class Factory {

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Urn' })
  urn_id: number;

  /**
   * The company the factory belongs to. Half of the natural key: a factory
   * key only has to be unique within its own company.
   */
  @Prop()
  owner_company_ifric_id: string;

  /**
   * The caller's own stable handle for this factory, minted once when the
   * factory is first created and never derived from anything a user can
   * edit. Deliberately not the factory's name: the id is a uuidv5 over this
   * key, so a rename would otherwise change the factory's identity.
   */
  @Prop()
  factory_key: string;

  @Prop()
  created_at: Date;

  @Prop()
  last_updated_at: Date;
}

export const FactorySchema = SchemaFactory.createForClass(Factory);

// The natural key, enforced by the database rather than only by the
// read-then-write check in the service. None of the older collections have
// this, which is why two concurrent identical requests can both insert there.
FactorySchema.index(
  { owner_company_ifric_id: 1, factory_key: 1 },
  { unique: true },
);
