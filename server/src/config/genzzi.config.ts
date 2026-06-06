import { GenzziServer } from "@genzzi/oauth-server";
export const GenzziConfig = new GenzziServer({
  client_id: process.env.GENZZI_CLIENT_ID ?? "",
  client_secret: process.env.GENZZI_CLIENT_SECRET ?? "",
  redirect_uri: process.env.GENZZI_REDIRECT_URI ?? "",
});
