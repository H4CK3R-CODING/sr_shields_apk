import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  type: String,
  salaryRange: String,
  description: String,
  requirements: String,
  deadline: Date,
  applyLink: String,
  driveFileId: String,
  status: { type: String, default: 'Open' }
});

export default mongoose.model('Job', jobSchema);
