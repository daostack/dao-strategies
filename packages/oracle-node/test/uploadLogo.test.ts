import { uploadLogoToS3 } from "../src/utils/awsClient";

const s3MockInstance = {
    upload: jest.fn().mockReturnThis(),
    promise: jest.fn(),
};

jest.mock('aws-sdk', () => {
    return { S3: jest.fn(() => s3MockInstance) };
});

describe('s3 upload context', () => {
    it('should upload logo to campaign asset bucket correctly', async () => {
        s3MockInstance.promise.mockResolvedValueOnce('upload logo successfully');
        const actual = await uploadLogoToS3('uniqueURI12345', 9999, Buffer.from('logoBuffer'));
        expect(actual).toEqual('upload logo successfully');
        // expect(s3MockInstance.upload).toBeCalledWith({ Bucket: 'bucket-dev', Key: 'key', Body: Buffer.from('logoBuffer') });
    });
});