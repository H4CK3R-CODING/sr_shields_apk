// controllers/jobController.js
import Job from '../models/Job.model.js';

// Create job (Admin only)
export const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      organization,
      location,
      category,
      salary,
      experience,
      requirements,
      deadline,
      status,
      isFeatured,
      isPinned,
      attachments
    } = req.body;

    if (!title || !description || !organization) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and organization are required'
      });
    }

    // Process attachments
    let processedAttachments = [];
    if (attachments && Array.isArray(attachments)) {
      processedAttachments = attachments.map(att => ({
        name: att.name,
        url: att.url || att.viewLink,
        type: att.type || att.mimeType || 'application/octet-stream',
        fileId: att.fileId || null,
        viewLink: att.viewLink || att.url,
        downloadLink: att.downloadLink || att.url,
        previewLink: att.previewLink || null,
        mimeType: att.mimeType || att.type || 'application/octet-stream',
        source: att.source || 'server-upload',
        size: att.size || null,
      }));
    }

    const job = new Job({
      title,
      description,
      organization,
      location,
      category: category || 'other',
      salary,
      experience,
      requirements: requirements || [],
      deadline: deadline || null,
      status: status || 'active',
      isFeatured: isFeatured || false,
      isPinned: isPinned || false,
      attachments: processedAttachments,
      createdBy: req.user.id
    });

    await job.save();
    await job.populate('createdBy', 'fullName email');

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      job
    });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating job',
      error: error.message
    });
  }
};

// Get all jobs (Admin)
export const getAllJobsAdmin = async (req, res) => {
  try {
    const { category, status, search, page = 1, limit = 20 } = req.query;

    let filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { organization: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const jobs = await Job.find(filter)
      .populate('createdBy', 'fullName email')
      .sort({ isPinned: -1, isFeatured: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(filter);

    const stats = {
      total: await Job.countDocuments(),
      active: await Job.countDocuments({ status: 'active' }),
      closed: await Job.countDocuments({ status: 'closed' }),
      featured: await Job.countDocuments({ isFeatured: true }),
      totalApplications: await Job.aggregate([
        { $unwind: '$applications' },
        { $count: 'total' }
      ]).then(result => result[0]?.total || 0)
    };

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      stats,
      jobs
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs',
      error: error.message
    });
  }
};

// Get active jobs (Users)
export const getActiveJobs = async (req, res) => {
  try {
    const { category, search } = req.query;

    let filter = {
      status: 'active',
      $or: [
        { deadline: null },
        { deadline: { $gte: new Date() } }
      ]
    };

    if (category) filter.category = category;
    if (search) {
      filter.$and = filter.$and || [];
      filter.$and.push({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { organization: { $regex: search, $options: 'i' } }
        ]
      });
    }

    const jobs = await Job.find(filter)
      .populate('createdBy', 'fullName')
      .sort({ isPinned: -1, isFeatured: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    console.error('Error fetching active jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs',
      error: error.message
    });
  }
};

// Track job view
export const trackJobView = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    const alreadyViewed = job.viewedBy.some(
      view => view.user.toString() === req.user.id.toString()
    );

    if (!alreadyViewed) {
      job.views += 1;
      job.viewedBy.push({ user: req.user.id, viewedAt: new Date() });
      await job.save();
    }

    res.status(200).json({
      success: true,
      message: 'View tracked'
    });
  } catch (error) {
    console.error('Error tracking view:', error);
    res.status(500).json({
      success: false,
      message: 'Error tracking view',
      error: error.message
    });
  }
};

// Apply for job
export const applyForJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and phone are required'
      });
    }

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'This job is not currently accepting applications'
      });
    }

    // Check if already applied
    const alreadyApplied = job.applications.some(
      app => app.email.toLowerCase() === email.toLowerCase()
    );

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    job.applications.push({
      applicant: req.user.id,
      name,
      email,
      phone,
      message: message || '',
      status: 'pending'
    });

    await job.save();

    res.status(200).json({
      success: true,
      message: 'Application submitted successfully'
    });
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting application',
      error: error.message
    });
  }
};

// Update job (Admin)
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.attachments && Array.isArray(updates.attachments)) {
      updates.attachments = updates.attachments.map(att => ({
        name: att.name,
        url: att.url || att.viewLink,
        type: att.type || att.mimeType || 'application/octet-stream',
        fileId: att.fileId || null,
        viewLink: att.viewLink || att.url,
        downloadLink: att.downloadLink || att.url,
        previewLink: att.previewLink || null,
        mimeType: att.mimeType || att.type || 'application/octet-stream',
        source: att.source || 'server-upload',
        size: att.size || null,
      }));
    }

    const job = await Job.findByIdAndUpdate(
      id,
      { ...updates },
      { new: true, runValidators: true }
    ).populate('createdBy', 'fullName email');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      job
    });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating job',
      error: error.message
    });
  }
};

// Delete job (Admin)
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findByIdAndDelete(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting job',
      error: error.message
    });
  }
};

// Get job applications (Admin)
export const getJobApplications = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id)
      .populate('applications.applicant', 'fullName email phone')
      .populate('createdBy', 'fullName email');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.status(200).json({
      success: true,
      job: {
        title: job.title,
        organization: job.organization,
        _id: job._id
      },
      applications: job.applications,
      count: job.applications.length
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching applications',
      error: error.message
    });
  }
};
