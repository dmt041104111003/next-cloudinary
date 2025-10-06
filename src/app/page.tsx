"use client";
import { useEffect, useState } from "react";
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
  const [signatureGet, setSignatureGet] = useState<string | null>(null);
  const [gallery, setGallery] = useState<Array<{ public_id: string }>>([]);
  const [limit, setLimit] = useState<number>(12);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api?limit=${limit}`);
        const data = await res.json();
        setGallery(data?.images ?? []);
      } catch {}
    })();
  }, [limit]);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section>
          {/* <CldUploadWidget
            signatureEndpoint="/api"
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
          </CldUploadWidget> */}

          <div style={{ marginTop: 12 }}>
            <CldUploadButton
              signatureEndpoint="/api"
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
          <div style={{ margin: "8px 0 16px" }}>
            <label>
              Count:&nbsp;
              <input
                type="number"
                min={1}
                max={100}
                value={limit}
                onChange={(e) => setLimit(Math.max(1, Math.min(100, Number(e.target.value) || 1)))}
                style={{ width: 80 }}
              />
            </label>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
            {gallery.map((img) => (
              <div key={img.public_id}>
                <CldImage
                  width="320"
                  height="240"
                  src={img.public_id}
                  alt={img.public_id}
                  crop="fill"
                  gravity="auto"
                />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
