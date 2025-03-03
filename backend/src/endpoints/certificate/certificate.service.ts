import { Injectable } from '@nestjs/common';
import { generatePrivateKey, createCSR, generateClientCertificate, verifyCertificate } from '../../utils/certificate';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class CertificateService {
  constructor() {}

  async generateCompanyCertificate(company_ifric_id: string, expiry: Date) {
    try {
      const { privateKey, publicKey } = generatePrivateKey();

      // Create CSR embedding UID (company_ifric_id) and expiry
      const csr = createCSR(privateKey, company_ifric_id, expiry);

      // Generate client certificate using Root CA
      const clientCert = generateClientCertificate(csr, expiry);

      return clientCert;
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

  async generateAssetCertificate(asset_ifric_id: string, expiry: Date) {
    try {
      const { privateKey, publicKey } = generatePrivateKey();
    
      // Create CSR embedding UID (asset_ifric_id) and expiry
      const csr = createCSR(privateKey, asset_ifric_id, expiry);
      
      // Generate client certificate using Root CA
      const clientCert = generateClientCertificate(csr, expiry);
      
      return clientCert;
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

  async verifyCertificate(certificate_data: string) {
    try {
      const formattedCertData = certificate_data.replace(/\\r\\n/g, '\n');
      return verifyCertificate(formattedCertData);
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

  async verifyAllAssetCertificate(data: { asset_ifric_id: string, certificate_data: string }[]) {
    try {
      const verfiedAssetCertificate = await Promise.all(
        data.map(async(value) => {
          try {
            if(value.certificate_data) {
              const response = await this.verifyCertificate(value.certificate_data);
              return {
                asset_ifric_id: value.asset_ifric_id,
                certified: response.valid
              }
            } else {
              return {
                asset_ifric_id: value.asset_ifric_id,
                certified: false
              }
            }
          } catch(err) {
            return {
              asset_ifric_id: value.asset_ifric_id,
              certified: false
            }
          }
        })
      )
      return verfiedAssetCertificate;
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
