// =====================================================
// 2. config/googleDrive.js - Google Drive Configuration
// =====================================================
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

// Load credentials from JSON file
const KEYFILEPATH = path.join(process.cwd(), 'google-credentials.json');
const SCOPES = ['https://www.googleapis.com/auth/drive'];

// Authenticate with Google
const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

// Create Drive instance
export const drive = google.drive({ version: 'v3', auth });

// Folder ID where files will be uploaded (create a folder in Google Drive and get its ID)
export const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || 'your-folder-id';

// Upload file to Google Drive
export const uploadToDrive = async (file) => {
  try {
    const fileMetadata = {
      name: file.originalname,
      parents: [FOLDER_ID],
    };

    const media = {
      mimeType: file.mimetype,
      body: fs.createReadStream(file.path),
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, name, webViewLink, webContentLink, mimeType, size',
    });

    // Make file publicly accessible
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    // Get the public link
    const fileData = await drive.files.get({
      fileId: response.data.id,
      fields: 'id, name, webViewLink, webContentLink, mimeType, size, thumbnailLink',
    });

    // Delete local file after upload
    fs.unlinkSync(file.path);

    return {
      id: fileData.data.id,
      name: fileData.data.name,
      viewLink: fileData.data.webViewLink,
      downloadLink: fileData.data.webContentLink,
      mimeType: fileData.data.mimeType,
      size: fileData.data.size,
      thumbnailLink: fileData.data.thumbnailLink,
    };
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    throw error;
  }
};

// Delete file from Google Drive
export const deleteFromDrive = async (fileId) => {
  try {
    await drive.files.delete({
      fileId: fileId,
    });
    return true;
  } catch (error) {
    console.error('Error deleting from Google Drive:', error);
    throw error;
  }
};

// Get file metadata
export const getFileMetadata = async (fileId) => {
  try {
    const response = await drive.files.get({
      fileId: fileId,
      fields: 'id, name, webViewLink, webContentLink, mimeType, size, thumbnailLink',
    });
    return response.data;
  } catch (error) {
    console.error('Error getting file metadata:', error);
    throw error;
  }
};
