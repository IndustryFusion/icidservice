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
import { CompanyService } from './company.service';
import { ApiBody } from '@nestjs/swagger';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @ApiBody({
    description: 'Details for creating a company',
    required: true,
    schema: {
      type: 'object',
      properties: {
        company_name: { 
          type: 'string', 
          example: 'Example Company Ltd.' 
        },
        registration_number: { 
          type: 'string', 
          example: 'REG123456' 
        },
        company_ifric_id: { 
          type: 'string', 
          example: 'IFRIC54321' 
        },
        address_1: { 
          type: 'string', 
          example: '123 Main Street' 
        },
        city: { 
          type: 'string', 
          example: 'New York' 
        },
        country: { 
          type: 'string', 
          example: 'USA' 
        },
        zip: { 
          type: 'string', 
          example: '10001' 
        },
        admin_name: { 
          type: 'string', 
          example: 'John Admin' 
        },
        position: { 
          type: 'string', 
          example: 'CEO' 
        },
        email: { 
          type: 'string', 
          example: 'admin@example.com' 
        },
        password: { 
          type: 'string', 
          example: 'strongpassword123' 
        },
        company_size: { 
          type: 'string', 
          example: '100-500' 
        },
        company_category_id: { 
          type: 'number', 
          example: 1 
        },
        company_category: { 
          type: 'string', 
          example: 'IT Services' 
        },
        meta_data: { 
          type: 'object', 
          additionalProperties: true,
          example: { industry: 'Technology', revenue: '1M+' } 
        },
        company_domain: { 
          type: 'string', 
          example: 'example.com' 
        }
      },
      required: [
        'company_name',
        'registration_number',
        'company_ifric_id',
        'address_1',
        'city',
        'country',
        'zip',
        'admin_name',
        'position',
        'email',
        'password',
        'company_size',
        'company_category',
        'meta_data',
        'company_domain',
      ],
    },
  })
  create(@Body() data: any) {
    return this.companyService.create(data);
  }

  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.companyService.update(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(id);
  }
}
