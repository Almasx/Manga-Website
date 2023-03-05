import * as aws from "aws-sdk";

import { env } from "../../env/server.mjs";

aws.config.update({
  accessKeyId: env.AWS_ACCESS_KEY_ID_ID,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  region: env.AWS_REGION,
  signatureVersion: "v4",
});

export const AWS = aws;
