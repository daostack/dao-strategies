import * as AWS from 'aws-sdk';
import { S3Client, AbortMultipartUploadCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

const bucketName = process.env.AWS_CAMPAIGN_ASSET_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new AWS.S3({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  region: region,
});

/* Takes a file stream and upload */
const uploadLogoToS3 = async (
  uri: string,
  currentTime: number,
  logoBuffer: Buffer
): Promise<string> => {
  if (!uri)
    throw new Error(
      'Cant upload logo to s3, uri paramter not given for this operation'
    );
  else if (!currentTime)
    throw new Error(
      'Cant upload logo to s3, currentTime paramter not given for this operation'
    );
  else if (!logoBuffer)
    throw new Error(
      'Cant upload logo to s3, logoBuffer paramter not given for this operation'
    );

  const uploadParams = {
    Bucket: bucketName, // name of the bucket --> campaign asset bucket
    Key: `${uri}${currentTime}`, // rename logo file to ${campaignId}{timestamp}
    Body: Buffer.from(logoBuffer), // we receive the buffer of the logo, we need a stream for s3 upload
  };
  // upload to s3 and get back url
  const uploadResult = await s3.upload(uploadParams).promise();
  return uploadResult.Location;
};

export { uploadLogoToS3 };
