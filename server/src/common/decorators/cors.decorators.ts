// cors-public.decorator.ts
import { SetMetadata } from "@nestjs/common";
export const PUBLIC_CORS = "public_cors";
export const PublicCors = () => SetMetadata(PUBLIC_CORS, true);
