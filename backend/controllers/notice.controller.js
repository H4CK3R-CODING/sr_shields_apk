import Notice from '../models/Notice.js';
import { uploadToDrive } from '../utils/driveUpload.js';

export const createNotice = async (req, res) => {
  let fileData = {};

  if (req.file) {
    fileData = await uploadToDrive(req.file);
  }

  const notice = await Notice.create({
    ...req.body,
    ...fileData
  });

  res.status(201).json(notice);
};

export const getNotices = async (req, res) => {
  const notices = await Notice.find().sort({ createdAt: -1 });
  res.json(notices);
};
