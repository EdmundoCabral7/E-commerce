import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';

// Configuração do armazenamento no Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'arcturoshop/products', // Pasta onde as imagens serão salvas
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }] // Opcional: redimensiona para otimizar
  } as any,
});

// Middleware Multer configurado para múltiplos arquivos (máx 5)
export const uploadMiddleware = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite de 5MB por imagem
    files: 5, // Máximo de 5 imagens por produto
  },
});

// Configuração para Categorias (Pasta diferente)
const categoryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'arcturoshop/categories',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  } as any,
});

export const uploadCategoryMiddleware = multer({
  storage: categoryStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limite menor para categorias (2MB)
});
