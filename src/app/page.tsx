"use client";
import { useState } from "react";
import styles from "./page.module.css";
import { CldImage, CldUploadButton, CldUploadWidget, CldVideoPlayer } from "next-cloudinary";

type UploadResult = {
  public_id: string;
  secure_url: string;
  resource_type: "image" | "video" | string;
  width?: number;
  height?: number;
  duration?: number;
};

export default function Home() {
  const [lastUpload, setLastUpload] = useState<UploadResult | null>(null);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Next Cloudinary Starter</h1>
        <p>Cloud name is read from <code>NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</code>.</p>

        <section>
          <h2>Optimized Image</h2>
          <p>Sample transform with automatic format and quality.</p>
          <div style={{ maxWidth: 400 }}>
            <CldImage
              width="800"
              height="600"
              src="sample"
              alt="Sample from Cloudinary"
              crop="fill"
              gravity="auto"
              priority
            />
          </div>
        </section>

        <section>
          <h2>Upload (Unsigned)</h2>
          <p>Opens the Cloudinary Upload Widget with default unsigned mode.</p>
          <CldUploadWidget
            uploadPreset=""
            onUpload={(result) => {
              if (result?.event === "success") {
                const info = result.info as any;
                setLastUpload({
                  public_id: info.public_id,
                  secure_url: info.secure_url,
                  resource_type: info.resource_type,
                  width: info.width,
                  height: info.height,
                  duration: info.duration,
                });
              }
            }}
          >
            {({ open }) => (
              <button className={styles.primary} onClick={() => open?.()}>Open Upload Widget</button>
            )}
          </CldUploadWidget>

          <div style={{ marginTop: 12 }}>
            <CldUploadButton
              uploadPreset=""
              onUploadAdded={() => {}}
              onUpload={(result) => {
                if ((result as any)?.event === "success") {
                  const info = (result as any).info;
                  setLastUpload({
                    public_id: info.public_id,
                    secure_url: info.secure_url,
                    resource_type: info.resource_type,
                    width: info.width,
                    height: info.height,
                    duration: info.duration,
                  });
                }
              }}
            />
          </div>

          {lastUpload && (
            <div style={{ marginTop: 16 }}>
              <p>
                Last upload: <code>{lastUpload.public_id}</code>
              </p>
              {lastUpload.resource_type === "image" ? (
                <CldImage
                  width="800"
                  height="600"
                  src={lastUpload.public_id}
                  alt="Uploaded image"
                  crop="fill"
                  gravity="auto"
                />
              ) : (
                <CldVideoPlayer
                  width="800"
                  height="600"
                  src={lastUpload.public_id}
                  controls
                />
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
