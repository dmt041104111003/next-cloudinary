import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!apiSecret) {
    return NextResponse.json(
      { error: "Missing CLOUDINARY_API_SECRET" },
      { status: 500 }
    );
  }

  try {
    const { paramsToSign } = (await req.json()) as {
      paramsToSign: Record<string, string | number | boolean | undefined>;
    };

    if (!paramsToSign || typeof paramsToSign !== "object") {
      return NextResponse.json(
        { error: "paramsToSign is required" },
        { status: 400 }
      );
    }

    const entries = Object.entries(paramsToSign)
      .filter(([, value]) => value !== undefined && value !== null && value !== "")
      .sort(([a], [b]) => a.localeCompare(b));

    const toSign = entries.map(([k, v]) => `${k}=${v}`).join("&");
    const signature = crypto
      .createHash("sha1")
      .update(`${toSign}${apiSecret}`)
      .digest("hex");

    return NextResponse.json({ signature });
  } catch (err) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}



export async function GET() {
  try {
    const result = await cloudinary.search
      .expression("resource_type:image")
      .sort_by("created_at", "desc")
      .max_results(12)
      .execute();

    const images = (result.resources || []).map((r: any) => ({
      public_id: r.public_id as string,
      width: r.width as number | undefined,
      height: r.height as number | undefined,
      format: r.format as string | undefined,
    }));

    return NextResponse.json({ images });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to fetch images" },
      { status: 500 }
    );
  }
}
