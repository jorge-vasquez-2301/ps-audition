const { assert } = require('chai');
const AWS = require('aws-sdk');

describe('Creating a S3 Bucket with a new file', function () {

    before(function () {
        AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile: 'ps_test' });
    });

    it('Task 1: Configure AWS credentials on your local machine', async function () {
        const sts = new AWS.STS();
        let credentialsFound;
        try {
            await sts.getCallerIdentity({}).promise();
            credentialsFound = true;
        } catch (err)  {
            credentialsFound  = false;
        }
        assert(credentialsFound, "AWS credentials not found or not configured correctly");
    });

    it('Task 2: Create a S3 bucket named ps-test-bucket-2020', async function () {
        const s3 = new AWS.S3();
        let bucketFound;
        try {
            await s3.headBucket({ Bucket: 'ps-test-bucket-2020' }).promise();
            bucketFound = true;
        } catch (err)  {
            bucketFound  = false;
        }
        assert(bucketFound, "Previous tasks not completed successfully, or ps-test-bucket-2020 bucket not found");
    });

    it('Task 3: Create a new object under ps-test-bucket-2020, named test-file.txt. The file should say Hello World!', async function () {
        const s3 = new AWS.S3();
        let objectFound;
        let objectContents = '';
        try {
            const data = await s3.getObject({ Bucket: 'ps-test-bucket-2020', Key: 'test-file.txt' }).promise();
            objectFound = true;
            objectContents = data.Body.toString('utf-8');
        } catch (err)  {
            objectFound  = false;
        }
        assert(objectFound, 'Previous tasks not completed successfully, or test-file.txt not found under ps-test-bucket-2020');
        assert(
            objectContents === 'Hello World!',
            `test-file.txt found under ps-test-bucket-2020, but it does not contain the text "Hello World!", it contains "${objectContents}" instead`
        );
    });
});
