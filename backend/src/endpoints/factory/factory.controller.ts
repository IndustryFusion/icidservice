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

import { Controller, Post, Body, Param, Delete } from '@nestjs/common';
import { FactoryService } from './factory.service';
import { ApiBody } from '@nestjs/swagger';
import { CreateFactoryDto } from './dto/create.dto';

@Controller('factory')
export class FactoryController {
  constructor(private readonly factoryService: FactoryService) {}

  @Post()
  @ApiBody({
    description:
      'Factory creation details. The identifier is derived from ' +
      'owner_company_ifric_id and factory_key only — the factory name is ' +
      'deliberately not an input, so renaming a factory never changes its id.',
    required: true,
    schema: {
      type: 'object',
      properties: {
        dataspace_code: {
          type: 'string',
          example: 'IFX',
        },
        region_code: {
          type: 'string',
          example: 'EU',
        },
        object_type_code: {
          type: 'string',
          example: 'LOC',
        },
        object_sub_type_code: {
          type: 'string',
          example: 'FAC',
        },
        owner_company_ifric_id: {
          type: 'string',
          example: 'urn:ifric:ifx-eur-com-nap-42ced491-b35d-41f7-9949-fcbb5fa4dcd9',
        },
        factory_key: {
          type: 'string',
          example: '7b1f0d5a-2c64-4a1e-9f3b-8f3d2a5c6e71',
        },
      },
      required: [
        'dataspace_code',
        'region_code',
        'object_type_code',
        'object_sub_type_code',
        'owner_company_ifric_id',
        'factory_key',
      ],
    },
  })
  create(@Body() data: CreateFactoryDto) {
    return this.factoryService.create(data);
  }

  /** Releases an id whose caller could not complete its own write. */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.factoryService.remove(id);
  }
}
