import { uploadLogoToS3 } from "../src/utils/awsClient";

const s3MockInstance = {
    upload: jest.fn().mockReturnThis(),
    promise: jest.fn(),
};

jest.mock('aws-sdk', () => {
    return { S3: jest.fn(() => s3MockInstance) };
});

describe('61830632', () => {
    it('should upload logo to campaign asset bucket correctly', async () => {

        s3MockInstance.promise.mockResolvedValueOnce('fake response');
        const actual = await uploadLogoToS3('uniqueURI12345', 9999, Buffer.from('logoBuffer'));
        expect(actual).toEqual('fake response');
        expect(s3MockInstance.upload).toBeCalledWith({ Bucket: 'bucket-dev', Key: 'key', Body: Buffer.from('logoBuffer') });
    });
});