export interface DeviceInfo {
  ip: string | null;
  geo: geo | null;
  browser: string;
  os: any;
  deviceType:
    | "console"
    | "desktop"
    | "embedded"
    | "mobile"
    | "smarttv"
    | "tablet"
    | "wearable"
    | "xr";
  fingerprint: string;
}

export interface geo {
  status: string;
  country: string;
  regionName: string;
  city: string;
  lat: string;
  lon: string;
  timezone: string;
  isp: string;
}
