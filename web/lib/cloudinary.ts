export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  filename: string;
  mimeType: string;
  size: number;
}

export const uploadToCloudinary = async (file: File): Promise<CloudinaryUploadResult> => {
  const signRes = await fetch("/api/cloudinary-sign", { method: "POST" });
  if (!signRes.ok) throw new Error("Failed to get upload signature");
  const { signature, timestamp, cloudName, apiKey } = await signRes.json();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("api_key", apiKey);
  formData.append("folder", "mail-assets");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    { method: "POST", body: formData },
  );

  const data = await res.json();
  if (!data.secure_url) throw new Error(`Cloudinary upload failed: ${data.error?.message}`);

  return {
    url: data.secure_url,                          // https://res.cloudinary.com/...
    publicId: data.public_id,                      // mail-assets/lrrkl0df8e7ao3fuqkxo
    filename: data.original_filename,              // genzzi-mail-mobile-inbox
    mimeType: `${data.resource_type}/${data.format}`, // image/png
    size: data.bytes,                              // 74977
  };
};