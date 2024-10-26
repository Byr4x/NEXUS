import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

export async function DELETE(request: Request) {
  const { publicId } = await request.json();

  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    return NextResponse.json({ error: 'Error deleting image' }, { status: 500 });
  }
}
