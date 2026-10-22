import { v2 as cloudinary } from 'cloudinary';
import { env } from './env';

cloudinary.config({
  cloud_name: env.CLOUDINARY.NAME,
  api_key: env.CLOUDINARY.API_KEY,
  api_secret: env.CLOUDINARY.API_SECRET,
});

/**
 * Remove uma imagem do Cloudinary pelo public_id.
 */
export async function deleteImage(publicId: string) {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(`Erro ao deletar imagem ${publicId} do Cloudinary:`, error);
  }
}

export default cloudinary;
