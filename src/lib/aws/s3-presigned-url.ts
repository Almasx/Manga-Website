import { AWS } from "lib/aws/aws-config";
import { env } from "env.mjs";

const s3 = new AWS.S3();
const UPLOADING_TIME_LIMIT = 600;
const UPLOAD_MAX_FILE_SIZE = 1000000;

export const s3CreatePresignedUrl = (key: string) =>
  new Promise((resolve, reject) => {
    s3.createPresignedPost(
      {
        Fields: {
          key: `${key}`,
        },
        Conditions: [
          ["starts-with", "$Content-Type", "image/"],
          ["content-length-range", 0, UPLOAD_MAX_FILE_SIZE],
        ],
        Expires: UPLOADING_TIME_LIMIT,
        Bucket: env.AWS_BUCKET_NAME,
      },
      (err, signed) => {
        if (err) return reject(err);
        resolve(signed);
      }
    );
  });
