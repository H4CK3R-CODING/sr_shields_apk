
// ========================================

// controllers/formController.js
import Form from '../models/Form.model.js';

// Create form (Admin only)
export const createForm = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      requirements,
      deadline,
      status,
      isImportant,
      isPinned,
      attachments
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
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

    const form = new Form({
      title,
      description,
      category: category || 'other',
      requirements: requirements || [],
      deadline: deadline || null,
      status: status || 'active',
      isImportant: isImportant || false,
      isPinned: isPinned || false,
      attachments: processedAttachments,
      createdBy: req.user.id
    });

    await form.save();
    await form.populate('createdBy', 'fullName email');

    res.status(201).json({
      success: true,
      message: 'Form created successfully',
      form
    });
  } catch (error) {
    console.error('Error creating form:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating form',
      error: error.message
    });
  }
};

// Get all forms (Admin)
export const getAllFormsAdmin = async (req, res) => {
  try {
    const { category, status, search, page = 1, limit = 20 } = req.query;

    let filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const forms = await Form.find(filter)
      .populate('createdBy', 'fullName email')
      .sort({ isPinned: -1, isImportant: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Form.countDocuments(filter);

    const stats = {
      total: await Form.countDocuments(),
      active: await Form.countDocuments({ status: 'active' }),
      closed: await Form.countDocuments({ status: 'closed' }),
      important: await Form.countDocuments({ isImportant: true }),
      totalDownloads: await Form.aggregate([
        { $group: { _id: null, total: { $sum: '$downloads' } } }
      ]).then(result => result[0]?.total || 0)
    };

    res.status(200).json({
      success: true,
      count: forms.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      stats,
      forms
    });
  } catch (error) {
    console.error('Error fetching forms:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching forms',
      error: error.message
    });
  }
};

// Get active forms (Users)
export const getActiveForms = async (req, res) => {
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
          { description: { $regex: search, $options: 'i' } }
        ]
      });
    }

    const forms = await Form.find(filter)
      .populate('createdBy', 'fullName')
      .sort({ isPinned: -1, isImportant: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: forms.length,
      forms
    });
  } catch (error) {
    console.error('Error fetching active forms:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching forms',
      error: error.message
    });
  }
};

// Track form view
export const trackFormView = async (req, res) => {
  try {
    const { id } = req.params;

    const form = await Form.findById(id);

    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Form not found'
      });
    }

    const alreadyViewed = form.viewedBy.some(
      view => view.user.toString() === req.user.id.toString()
    );

    if (!alreadyViewed) {
      form.views += 1;
      form.viewedBy.push({ user: req.user.id, viewedAt: new Date() });
      await form.save();
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

// Update form (Admin)
export const updateForm = async (req, res) => {
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

    const form = await Form.findByIdAndUpdate(
      id,
      { ...updates },
      { new: true, runValidators: true }
    ).populate('createdBy', 'fullName email');

    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Form not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Form updated successfully',
      form
    });
  } catch (error) {
    console.error('Error updating form:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating form',
      error: error.message
    });
  }
};

// Delete form (Admin)
export const deleteForm = async (req, res) => {
  try {
    const { id } = req.params;

    const form = await Form.findByIdAndDelete(id);

    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Form not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Form deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting form:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting form',
      error: error.message
    });
  }
};
