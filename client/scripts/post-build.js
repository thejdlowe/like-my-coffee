const {
	S3Client,
	HeadBucketCommand,
	ListObjectsV2Command,
	GetObjectCommand,
} = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");
const { pipeline } = require("stream");
const { promisify } = require("util");
const streamPipeline = promisify(pipeline);

require("dotenv").config();

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const AWS_BUCKET_REGION = process.env.AWS_BUCKET_REGION;
const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_KEY = process.env.AWS_SECRET;

const s3Client = new S3Client({
	region: AWS_BUCKET_REGION,
	credentials: {
		accessKeyId: AWS_ACCESS_KEY,
		secretAccessKey: AWS_SECRET_KEY,
	},
});

const TARGET_DIR = path.join(__dirname, "../build/media");

const syncImages = async () => {
	try {
		await s3Client.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }));
	} catch (error) {
		console.error("Error occurred while syncing images:", error);
		return;
	}
	try {
		const listCommand = new ListObjectsV2Command({ Bucket: BUCKET_NAME });
		const response = await s3Client.send(listCommand);

		if (!response.Contents || response.Contents.length === 0) {
			console.log("S3 bucket is empty. No files to download.");
			return;
		}

		if (fs.existsSync(TARGET_DIR)) {
			fs.rmSync(TARGET_DIR, { recursive: true, force: true });
		}
		fs.mkdirSync(TARGET_DIR, { recursive: true });

		for (const object of response.Contents) {
			const fileKey = object.Key;
			if (!fileKey || fileKey.endsWith("/")) continue; // Skip folder markers

			const getCommand = new GetObjectCommand({
				Bucket: BUCKET_NAME,
				Key: fileKey,
			});
			const s3Response = await s3Client.send(getCommand);

			const localFilePath = path.join(TARGET_DIR, path.basename(fileKey));
			console.log(`Downloading ${fileKey} to ${localFilePath}...`);

			await streamPipeline(
				s3Response.Body,
				fs.createWriteStream(localFilePath),
			);
		}
	} catch (error) {
		console.error("Error occurred while syncing images:", error);
	}
};

syncImages();
