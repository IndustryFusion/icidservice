import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CreateCompanyCertificateDto, CreateAssetCertificateDto } from './dto/create-certificate.dto';
import { ApiBody } from '@nestjs/swagger';


@Controller('certificate')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}
  @Post('create-company-certificate')
  @ApiBody({
    description: 'Create Company Certificate details',
    required: true,
    schema: {
      type: 'object',
      properties: {
        company_ifric_id: {
          type: 'string',
          example: 'C987654321',
        },
        expiry: {
          type: 'string',
          format: 'date-time',
          example: '2025-12-31T23:59:59.999Z',
        },
      },
      required: ['company_ifric_id', 'expiry'],
    },
  })  
  async generateCompanyCertificate(@Body() data: CreateCompanyCertificateDto) {
    try {
      return await this.certificateService.generateCompanyCertificate_new(data.company_ifric_id, new Date(data.expiry));
    } catch(err) {
      throw err;
    }
  }

  @Post('create-batch-asset-certificate')
  @ApiBody({
    description: 'Create Batch Asset Certificate details',
    required: true,
    schema: {
      type: 'array',
      items: {
        type: 'object',
        example: { assetIds: ['A123456789'], expiry: '2025-12-31T23:59:59.999Z' }
      }
    },
  })  
  async generateBatchAssetCertificate(@Body() data: {assetIds: string[], expiry: Date}) {
    try {
      return await this.certificateService.generateBatchAssetCertificate(data.assetIds, new Date(data.expiry));
    } catch(err) {
      throw err;
    }
  }

  @Post('create-asset-certificate')
  @ApiBody({
    description: 'Create Asset Certificate details',
    required: true,
    schema: {
      type: 'object',
      properties: {
        asset_ifric_id: {
          type: 'string',
          example: 'A123456789',
        },
        expiry: {
          type: 'string',
          format: 'date-time',
          example: '2025-12-31T23:59:59.999Z',
        },
      },
      required: ['asset_ifric_id', 'expiry'],
    },
  })  
  async generateAssetCertificate(@Body() data: CreateAssetCertificateDto) {
    try {
      return await this.certificateService.generateAssetCertificate(data.asset_ifric_id, new Date(data.expiry));
    } catch(err) {
      throw err;
    }
  }

  @Post('verify-company-certificate')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        company_ifric_id: { 
          type: 'string', 
          description: 'Unique identifier for the company',
          example: 'IFRIC12345'
        },
        fileId: { 
          type: 'string', 
          description: 'File Id of hedera to be verified',
          example: '0.01.20222'
        }
      },
      required: ['company_ifric_id', 'fileId']
    }
  })  
  async verifyCertificate(@Body() data: {company_ifric_id: string, fileId: string}) {
    try {
      return await this.certificateService.verifyCertificate_new(data.fileId);
    } catch(err) {
      throw err;
    }
  }

  @Post('verify-asset-certificate')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        asset_ifric_id: { 
          type: 'string', 
          description: 'Unique identifier for the asset',
          example: 'Asset12345'
        },
        certificate_data: { 
          type: 'string', 
          description: 'Certificate data to be verified',
          example: 'base64encodedcertificatestring'
        }
      },
      required: ['asset_ifric_id', 'certificate_data']
    }
  })  
  async verifyAssetCertificate(@Body() data: {asset_ifric_id: string, certificate_data: string}) {
    try {
      return await this.certificateService.verifyCertificate(data.certificate_data);
    } catch(err) {
      throw err;
    }
  }

  @Post('verify-all-asset-certificate')
  @ApiBody({
    schema: {
      type: 'array',
      items: {
        type: 'object',
        example: { asset_ifric_id: 'Asset12345', certificate_data: 'base64encodedcertificatestring' }
      },
    }
  })  
  async verifyAllAssetCertificate(@Body() data: {asset_ifric_id: string, certificate_data: string}[]) {
    try {
      return await this.certificateService.verifyAllAssetCertificate(data);
    } catch(err) {
      throw err;
    }
  }
}
