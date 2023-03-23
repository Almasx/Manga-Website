import axios from "axios";
import { env } from "env.mjs";

const VK_URI = "https://api.vk.com/method/";

export const isGroupDon = async (access_token: string) => {
  const { data } = await axios.get(VK_URI + "donut.isDon", {
    params: { access_token, owner_id: env.VK_GROUP_ID, v: "5.131" },
  });
  return !!data.responce;
};
