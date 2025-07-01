// import * as crypto from 'crypto';
// import * as forge from 'node-forge';
// import * as dotenv from 'dotenv';
// import { readFileSync } from 'fs';
// dotenv.config();

// // Load the Root CA certificate and key from environment paths
// const KeyPath = process.env.KEY_PATH;
// const certificatePath = process.env.CERTIFICATE_PATH;
// const rootCA = {
//   cert: readFileSync(certificatePath, 'utf8'),
//   key: readFileSync(KeyPath, 'utf8'),
// };

// // Function to create a private key
// export function generatePrivateKey() {
//   return crypto.generateKeyPairSync('rsa', {
//     modulusLength: 2048,
//   });
// }

// // Function to create a CSR with UID and expiry date
// export function createCSR(privateKey: crypto.KeyObject, uid: string, expiryDate: Date) {
//   const csr = forge.pki.createCertificationRequest();
  
//   // Correctly export the public key from the private key in PEM format
//   const publicKeyPem = crypto.createPublicKey(privateKey).export({ type: 'spki', format: 'pem' }) as string;
//   csr.publicKey = forge.pki.publicKeyFromPem(publicKeyPem);

//   // Set a valid subject attribute, using commonName (CN) or another valid attribute
//   csr.setSubject([
//     {
//       name: 'commonName',
//       value: uid,  
//     },
//   ]);

//   // Add expiration info via extensions
//   csr.setAttributes([{
//     name: 'extensionRequest',
//     extensions: [{
//       name: 'basicConstraints',
//       critical: true,
//       cA: false,
//     }, {
//       name: 'subjectAltName',
//       altNames: [{ type: 2, value: `UID: ${uid}, Expiry: ${expiryDate.toISOString()}` }],
//     }],
//   }]);

//   // Sign the CSR with the private key
//   const privateKeyPem = privateKey.export({ type: 'pkcs8', format: 'pem' }) as string;
//   csr.sign(forge.pki.privateKeyFromPem(privateKeyPem));

//   // Return the CSR in PEM format
//   return forge.pki.certificationRequestToPem(csr);
// }

// // Function to generate client certificate
// export function generateClientCertificate(csrPem: string, expiry: Date) {
 
//   const csr = forge.pki.certificationRequestFromPem(csrPem);

//   // creates certificate under x.509 standard
//   const clientCert = forge.pki.createCertificate();
//   clientCert.serialNumber = new Date().getTime().toString();
//   clientCert.publicKey = csr.publicKey;
//   clientCert.validity.notBefore = new Date();
//   clientCert.validity.notAfter = expiry;

//   // Use Root CA to sign the client certificate
//   clientCert.setIssuer(forge.pki.certificateFromPem(rootCA.cert).subject.attributes);
//   clientCert.sign(forge.pki.privateKeyFromPem(rootCA.key));

//   return forge.pki.certificateToPem(clientCert);
// }

// // Function to verify the certificate and check expiry
// export function verifyCertificate(certPem: string) {
//   try {
//     // Convert the PEM certificate to a Forge certificate object
//     const cert = forge.pki.certificateFromPem(certPem);

//     // Get the current date to check expiry
//     const now = new Date();

//     // Check if the certificate is expired
//     if (now > cert.validity.notAfter) { // If have no limit for cert expiry date, once implementd we need to add this condtion || now < cert.validity.notBefore 
//       throw new Error('Certificate is expired or not yet valid');
//     }

//     // Verify the certificate using the Root CA
//     const rootCert = forge.pki.certificateFromPem(rootCA.cert);
//     const verified = rootCert.verify(cert);

//     if (!verified) {
//       throw new Error('Certificate verification failed');
//     }

//     // Return the verification and expiry check result
//     return {
//       valid: true,
//       message: 'Certificate is valid and not expired',
//     };
//   } catch (error) {
//     return {
//       valid: false,
//       message: error.message,
//     };
//   }
// }
