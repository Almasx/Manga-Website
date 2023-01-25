import * as aws from "aws-sdk";
import { env } from "process";

aws.config.update({
  accessKeyId: env.AWS_ACCESS_KEY,
  secretAccessKey: env.AWS_SECRET_KEY,
  region: env.AWS_REGION,
  signatureVersion: "v4",
});

export const AWS = aws;
