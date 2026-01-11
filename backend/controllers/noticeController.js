// controllers/noticeController.js
import Notice from '../models/Notice.model.js';

// Create notice (Admin only)
export const createNotice = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      priority,
      targetAudience,
      isPinned,
      expiryDate
    } = req.body;

    // Validation
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }

    const notice = new Notice({
      title,
      description,
      category: category || 'general',
      priority: priority || 'normal',
      targetAudience: targetAudience || 'all',
      isPinned: isPinned || false,
      expiryDate: expiryDate || null,
      createdBy: req.user.id
    });

    await notice.save();

    res.status(201).json({
      success: true,
      message: 'Notice created successfully',
      notice
    });
  } catch (error) {
    console.error('Error creating notice:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating notice',
      error: error.message
    });
  }
};

// Get all notices (Admin)
export const getAllNoticesAdmin = async (req, res) => {
  try {
    const { category, priority, isActive, search, page = 1, limit = 20 } = req.query;

    // Build filter
    let filter = {};
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const notices = await Notice.find(filter)
      .populate('createdBy', 'fullName email')
      .sort({ isPinned: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Notice.countDocuments(filter);

    // Get statistics
    const stats = {
      total: await Notice.countDocuments(),
      active: await Notice.countDocuments({ isActive: true }),
      inactive: await Notice.countDocuments({ isActive: false }),
      pinned: await Notice.countDocuments({ isPinned: true }),
      expired: await Notice.countDocuments({
        expiryDate: { $lt: new Date() },
        isActive: true
      })
    };

    res.status(200).json({
      success: true,
      count: notices.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      stats,
      notices
    });
  } catch (error) {
    console.error('Error fetching notices:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notices',
      error: error.message
    });
  }
};

// Get active notices for users
export const getActiveNotices = async (req, res) => {
  try {
    const { category, priority } = req.query;
    const userRole = req.user.role;

    // Build filter
    let filter = {
      isActive: true,
      $or: [
        { expiryDate: null },
        { expiryDate: { $gte: new Date() } }
      ]
    };

    // Target audience filter
    if (userRole === 'user') {
      filter.targetAudience = { $in: ['all', 'users'] };
    } else if (userRole === 'admin') {
      filter.targetAudience = { $in: ['all', 'admins'] };
    }

    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    const notices = await Notice.find(filter)
      .populate('createdBy', 'fullName')
      .sort({ isPinned: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notices.length,
      notices
    });
  } catch (error) {
    console.error('Error fetching active notices:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notices',
      error: error.message
    });
  }
};

// Get single notice
export const getNoticeById = async (req, res) => {
  try {
    const { id } = req.params;

    const notice = await Notice.findById(id)
      .populate('createdBy', 'fullName email role');

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }

    // Increment view count and add user to viewedBy if not already viewed
    if (!notice.viewedBy.includes(req.user.id)) {
      notice.views += 1;
      notice.viewedBy.push(req.user.id);
      await notice.save();
    }

    res.status(200).json({
      success: true,
      notice
    });
  } catch (error) {
    console.error('Error fetching notice:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notice',
      error: error.message
    });
  }
};

// Update notice (Admin only)
export const updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const notice = await Notice.findByIdAndUpdate(
      id,
      { ...updates },
      { new: true, runValidators: true }
    );

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notice updated successfully',
      notice
    });
  } catch (error) {
    console.error('Error updating notice:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating notice',
      error: error.message
    });
  }
};

// Toggle notice status (Admin only)
export const toggleNoticeStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const notice = await Notice.findById(id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }

    notice.isActive = !notice.isActive;
    await notice.save();

    res.status(200).json({
      success: true,
      message: `Notice ${notice.isActive ? 'activated' : 'deactivated'} successfully`,
      notice
    });
  } catch (error) {
    console.error('Error toggling notice status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating notice status',
      error: error.message
    });
  }
};

// Toggle pin status (Admin only)
export const togglePinStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const notice = await Notice.findById(id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }

    notice.isPinned = !notice.isPinned;
    await notice.save();

    res.status(200).json({
      success: true,
      message: `Notice ${notice.isPinned ? 'pinned' : 'unpinned'} successfully`,
      notice
    });
  } catch (error) {
    console.error('Error toggling pin status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating pin status',
      error: error.message
    });
  }
};

// Delete notice (Admin only)
export const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;

    const notice = await Notice.findByIdAndDelete(id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notice deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting notice:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting notice',
      error: error.message
    });
  }
};