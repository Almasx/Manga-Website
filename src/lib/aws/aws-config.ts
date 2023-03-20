import * as aws from "aws-sdk";

import { env } from "../../env/server.mjs";

aws.config.update({
  accessKeyId: env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_S3_SECRET_ACCESS_KEY,
  region: env.AWS_S3_REGION,
  signatureVersion: "v4",
});

export const AWS = aws;
