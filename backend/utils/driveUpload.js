// import { drive } from '../config/googleDrive.js';

// export const uploadToDrive = async (file) => {
//   const response = await drive.files.create({
//     requestBody: {
//       name: file.originalname,
//       mimeType: file.mimetype
//     },
//     media: {
//       mimeType: file.mimetype,
//       body: file.stream
//     }
//   });

//   return {
//     fileId: response.data.id,
//     fileName: file.originalname,
//     fileSize: file.size
//   };
// };
