import fs from 'fs';
import { S3Client, PutBucketCorsCommand } from '@aws-sdk/client-s3';

const envPath = fs.existsSync('.env.local') ? '.env.local' : '.env';
const envContent = fs.readFileSync(envPath, 'utf-8');
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [k, ...v] = trimmed.split('=');
    if (k) process.env[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '');
  }
});

const client = new S3Client({
  region: 'ap-southeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function run() {
  try {
    const corsParams = {
      Bucket: 'cargo-desk',
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedHeaders: ['*'],
            AllowedMethods: ['GET', 'PUT', 'POST', 'HEAD', 'DELETE'],
            AllowedOrigins: ['*'],
            ExposeHeaders: ['ETag'],
            MaxAgeSeconds: 3000,
          },
        ],
      },
    };

    await client.send(new PutBucketCorsCommand(corsParams));
    console.log('SUCCESS: S3 Bucket CORS updated successfully!');
  } catch (err) {
    console.error('FAILED to set S3 CORS:', err.name, err.message);
  }
}

run();
