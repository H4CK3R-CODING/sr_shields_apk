
// =====================================================
// 5. controllers/fileController.js - File Upload Controller
// =====================================================
import { uploadToDrive, deleteFromDrive, getFileMetadata } from '../config/googleDrive.js';
import Notice from '../models/Notice.model.js';

// Upload file to Google Drive
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    // Upload to Google Drive
    const fileData = await uploadToDrive(req.file);

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      file: fileData,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading file',
      error: error.message,
    });
  }
};

// Upload multiple files to Google Drive
export const uploadMultipleFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded',
      });
    }

    // Upload all files to Google Drive
    const uploadPromises = req.files.map(file => uploadToDrive(file));
    const filesData = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      message: 'Files uploaded successfully',
      files: filesData,
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading files',
      error: error.message,
    });
  }
};

// Add attachment to notice
export const addAttachmentToNotice = async (req, res) => {
  try {
    const { noticeId } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    // Upload to Google Drive
    const fileData = await uploadToDrive(req.file);

    // Find notice and add attachment
    const notice = await Notice.findById(noticeId);
    
    if (!notice) {
      // Delete uploaded file if notice not found
      await deleteFromDrive(fileData.id);
      return res.status(404).json({
        success: false,
        message: 'Notice not found',
      });
    }

    // Add attachment
    notice.attachments.push({
      fileId: fileData.id,
      name: fileData.name,
      viewLink: fileData.viewLink,
      downloadLink: fileData.downloadLink,
      mimeType: fileData.mimeType,
      size: fileData.size,
      thumbnailLink: fileData.thumbnailLink,
    });

    await notice.save();

    res.status(200).json({
      success: true,
      message: 'Attachment added successfully',
      notice,
    });
  } catch (error) {
    console.error('Error adding attachment:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding attachment',
      error: error.message,
    });
  }
};

// Remove attachment from notice
export const removeAttachmentFromNotice = async (req, res) => {
  try {
    const { noticeId, attachmentId } = req.params;

    const notice = await Notice.findById(noticeId);
    
    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found',
      });
    }

    // Find attachment
    const attachment = notice.attachments.id(attachmentId);
    
    if (!attachment) {
      return res.status(404).json({
        success: false,
        message: 'Attachment not found',
      });
    }

    // Delete from Google Drive
    await deleteFromDrive(attachment.fileId);

    // Remove from notice
    notice.attachments.pull(attachmentId);
    await notice.save();

    res.status(200).json({
      success: true,
      message: 'Attachment removed successfully',
      notice,
    });
  } catch (error) {
    console.error('Error removing attachment:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing attachment',
      error: error.message,
    });
  }
};

