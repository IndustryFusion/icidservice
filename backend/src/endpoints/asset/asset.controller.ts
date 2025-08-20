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

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AssetService } from './asset.service';
import { ApiBody } from '@nestjs/swagger';

@Controller('asset')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post()
  @ApiBody({
    description: 'Asset creation details',
    required: true,
    schema: {
      type: 'object',
      properties: {
        dataspace_code: {
          type: 'string',
          example: 'DS001',
        },
        region_code: {
          type: 'string',
          example: 'US-WEST',
        },
        object_type_code: {
          type: 'string',
          example: 'TYPE123',
        },
        object_sub_type_code: {
          type: 'string',
          example: 'SUBTYPE456',
        },
        machine_serial_number: {
          type: 'string',
          example: 'SN1234567890',
        },
        registration_number: {
          type: 'string',
          example: 'REG12345',
        },
      },
      required: [
        'dataspace_code',
        'region_code',
        'object_type_code',
        'object_sub_type_code',
        'machine_serial_number',
        'registration_number',
      ],
    },
  })  
  create(@Body() data: any) {
    return this.assetService.create(data);
  }

  @Get()
  findAll() {
    return this.assetService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assetService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({
    description: 'Asset creation details',
    required: true,
    schema: {
      type: 'object',
      properties: {
        dataspace_code: {
          type: 'string',
          example: 'DS001',
        },
        region_code: {
          type: 'string',
          example: 'US-WEST',
        },
        object_type_code: {
          type: 'string',
          example: 'TYPE123',
        },
        object_sub_type_code: {
          type: 'string',
          example: 'SUBTYPE456',
        },
        machine_serial_number: {
          type: 'string',
          example: 'SN1234567890',
        },
        registration_number: {
          type: 'string',
          example: 'REG12345',
        },
      },
    },
  })  
  update(@Param('id') id: string, @Body() data: any) {
    return this.assetService.update(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assetService.remove(id);
  }
}
