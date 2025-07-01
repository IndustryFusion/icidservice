import { Injectable } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CertificateService {
  constructor() { }
  private readonly hbarUrl = process.env.HBAR_URL;
  private readonly assetVcTopicId = process.env.ASSET_VC_TOPIC_ID;

  async generateCompanyCertificate_new(company_ifric_id: string, expiry: Date) {
    try {
      const payload = {
        companyUrn: company_ifric_id
      };
      const response = await axios.post(this.hbarUrl + "/account/create-subaccount", payload);
      console.log('Response:', response.data);
      return response.data;

    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      } else if (err.response) {
        throw new HttpException(err.response.data.message, err.response.status);
      } else {
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  // async generateCompanyCertificate(company_ifric_id: string, expiry: Date) {
  //   try {
  //     const { privateKey, publicKey } = generatePrivateKey();

  //     // Create CSR embedding UID (company_ifric_id) and expiry
  //     const csr = createCSR(privateKey, company_ifric_id, expiry);

  //     // Generate client certificate using Root CA
  //     const clientCert = generateClientCertificate(csr, expiry);

  //     return clientCert;
  //   } catch (err) {
  //     if (err instanceof HttpException) {
  //       throw err;
  //     } else if (err.response) {
  //       throw new HttpException(err.response.data.message, err.response.status);
  //     } else {
  //       throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
  //     }
  //   }
  // }


  // async generateAssetCertificate(asset_ifric_id: string, expiry: Date) {
  //   try {
  //     const { privateKey, publicKey } = generatePrivateKey();

  //     // Create CSR embedding UID (asset_ifric_id) and expiry
  //     const csr = createCSR(privateKey, asset_ifric_id, expiry);

  //     // Generate client certificate using Root CA
  //     const clientCert = generateClientCertificate(csr, expiry);

  //     return clientCert;
  //   } catch (err) {
  //     if (err instanceof HttpException) {
  //       throw err;
  //     } else if (err.response) {
  //       throw new HttpException(err.response.data.message, err.response.status);
  //     } else {
  //       throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
  //     }
  //   }
  // }


  async generateAssetCertificate_new(asset_ifric_id: string, holderDid: string, location: string, status: string, privateKey: string, subAccountId: string) {
    try {
      const payload = {
        holderDid: holderDid,
        twinUrn: asset_ifric_id,
        location: location,
        status: status,
        privateKey: privateKey,
        subAccountId: subAccountId
      };
      const response = await axios.post(this.hbarUrl + "/vc/issue", payload);
      console.log('Response:', response.data);
      return response.data;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      } else if (err.response) {
        throw new HttpException(err.response.data.message, err.response.status);
      } else {
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }


  async generateBatchAssetCertificate_new(assetIds: Record<string, any>[], holderDid: string, location: string, privateKey: string, subAccountId: string) {
    try {
      const payload = {
        holderDid: holderDid,
        location: location,
        privateKey: privateKey,
        subAccountId: subAccountId,
        twins: assetIds
      };
      const response = await axios.post(this.hbarUrl + "/vc/issue-batch", payload);
      console.log('Response:', response.data);
      return response.data;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      } else if (err.response) {
        throw new HttpException(err.response.data.message, err.response.status);
      } else {
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  // async generateBatchAssetCertificate(assetIds: string[], expiry: Date) {
  //   try {
  //     const assetCertificates = [];
  //     assetIds.forEach((asset_ifric_id: string) => {
  //       const { privateKey, publicKey } = generatePrivateKey();

  //       // Create CSR embedding UID (asset_ifric_id) and expiry
  //       const csr = createCSR(privateKey, asset_ifric_id, expiry);

  //       // Generate client certificate using Root CA
  //       const clientCert = generateClientCertificate(csr, expiry);
  //       assetCertificates.push({
  //         certificate_data: clientCert,
  //         asset_ifric_id
  //       });

  //     })
  //     return assetCertificates;
  //   } catch (err) {
  //     if (err instanceof HttpException) {
  //       throw err;
  //     } else if (err.response) {
  //       throw new HttpException(err.response.data.message, err.response.status);
  //     } else {
  //       throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
  //     }
  //   }
  // }


  async verifyCertificate_new(fileId: string) {
    try {
      const response = await axios.get(this.hbarUrl + "/did/" + fileId + "/status");
      console.log('Response:', response.data);
      return response.data;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      } else if (err.response) {
        throw new HttpException(err.response.data.message, err.response.status);
      } else {
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async verifyAssetCertificate(asset_ifric_id: string) {
    try {
      const vcId = asset_ifric_id.split(":")[2];
      const pVcId = "urn:vc:product:" + vcId;
      const response = await axios.get(this.hbarUrl + "/vc/" + pVcId + "/" + this.assetVcTopicId + "/status");
      if (response.data.revoked) {
        return false;
      } else {
        return true;
      }
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      } else if (err.response) {
        throw new HttpException(err.response.data.message, err.response.status);
      } else {
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async verifyAllAssetCertificate(data: { asset_ifric_id: string }[]) {
    try {
      const verfiedAssetCertificate = await Promise.all(
        data.map(async (value) => {
          try {
            if (value.asset_ifric_id) {
              const response = await this.verifyAssetCertificate(value.asset_ifric_id);
              return {
                asset_ifric_id: value.asset_ifric_id,
                certified: response ? true : false
              }
            }
          } catch (err) {
            console.error(`Error verifying asset certificate for ${value.asset_ifric_id}:`, err);
          }
        })
      )
      return verfiedAssetCertificate;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      } else if (err.response) {
        throw new HttpException(err.response.data.message, err.response.status);
      } else {
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
