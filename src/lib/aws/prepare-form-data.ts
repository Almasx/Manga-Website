import type { PresignedPost } from "aws-sdk/clients/s3";

interface IPrepareFromData {
  page: any;
  fields: PresignedPost["fields"];
}

export function prepareFormData({ fields, page }: IPrepareFromData) {
  const formData = new FormData();
  Object.keys(fields).forEach((name) => {
    formData.append(name, fields[name] as string);
  });
  formData.append("Content-Type", page.type);
  formData.append("file", page);

  return formData;
}
