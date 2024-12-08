import { defineAction } from "astro:actions";
import { S3Client } from "@aws-sdk/client-s3";
import { z } from "astro:schema";
import { Upload } from "@aws-sdk/lib-storage";

const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${import.meta.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: import.meta.env.CLOUDFLARE_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.CLOUDFLARE_SECRET_ACCESS_KEY,
  },
});

export const server = {
  uploadBucketImage: defineAction({
    accept: "form",
    input: z.object({
      Bucket: z.string(),
      Key: z.string(),
      Body: z.instanceof(File),
    }),
    handler: async (input) => {
      try {
        const parallelUploads3 = new Upload({
          client: S3,
          params: input,
        });

        parallelUploads3.on("httpUploadProgress", (progress) => {
          console.log(progress);
        });

        await parallelUploads3.done();
      } catch (e) {
        console.log(e);
      }
    },
  }),
};
