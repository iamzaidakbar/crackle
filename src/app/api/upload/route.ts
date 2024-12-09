import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Update user with base64 image
    const user = await prisma.user.update({
      where: { id: userId },
      data: { image: base64Image },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
      },
    });

    return NextResponse.json({
      message: "Image uploaded successfully",
      user,
    });
  } catch (error) {
    console.error("[Upload API] Error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Error uploading file",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
