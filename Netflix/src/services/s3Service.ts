import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'netflix-assets';

// Upload de imagem para S3
export const uploadImage = async (file: Buffer, key: string) => {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: 'image/jpeg',
  });
  
  return await s3Client.send(command);
};

// Gerar URL assinada para imagem
export const getImageUrl = async (key: string) => {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });
  
  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
};

// URL pública para imagens
export const getPublicImageUrl = (key: string) => {
  return `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
};