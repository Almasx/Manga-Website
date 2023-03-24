import { Knock } from "@knocklabs/node";

export const knockClient = new Knock(process.env.KNOCK_SECRET_API_KEY);

export const workflows = {
  chapterPublication: "chapter-publication",
  rateComment: "rate-comment"
} as const;
