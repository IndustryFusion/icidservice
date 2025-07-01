export class CreateAssetCertificateDto {
    asset_ifric_id: string;
    expiry: Date;
    holderDid: string;
    location: string;
    status: string;
    privateKey: string;
    subAccountId: string;
}

export class CreateCompanyCertificateDto {
    company_ifric_id: string;
    expiry: Date;
}