import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const uploadVideo = async ( file) => {
  const buffer = Buffer.from(await file.arrayBuffer());

  const uploadedFileData = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "hireheaven",
           resource_type: "video",
          access_mode: "public",
        },
        (err, result) => {
          return resolve(result);
        }
      )
      .end(buffer);
  });

  return uploadedFileData;
};

export default uploadVideo;
