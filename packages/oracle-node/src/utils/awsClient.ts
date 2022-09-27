import * as AWS from 'aws-sdk';
import { S3Client, AbortMultipartUploadCommand } from "@aws-sdk/client-s3";

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

export const s3 = new AWS.S3({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region,

});

export const CAMPAIGN_ASSET_BUCKET = bucketName