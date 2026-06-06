import React, { useMemo } from "react";

export default function SiteLogo({
  variantIndex = 0,
  className = "",
  alt = "Quentrax",
  sizes,
}: {
  variantIndex?: number;
  className?: string;
  alt?: string;
  sizes?: string;
}) {
  // List all images in the public folder to rotate through.
  const logos = ["/logo.jpeg"];

  const src = useMemo(() => logos[variantIndex % logos.length], [variantIndex]);

  return <img src={src} alt={alt} className={className} sizes={sizes} />;
}
