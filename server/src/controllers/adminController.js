import { User } from "../models/User.js";
import { Resume } from "../models/Resume.js";

// @desc    Get dashboard stats (total users, total resumes)
// @route   GET /api/admin/stats
// @access  Private/Admin
export async function getStats(req, res, next) {
  try {
    const totalUsers = await User.countDocuments();
    const totalResumes = await Resume.countDocuments();
    
    // Additional basic stats (e.g., users added in last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const newUsersLastWeek = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    const newResumesLastWeek = await Resume.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalResumes,
        newUsersLastWeek,
        newResumesLastWeek,
      }
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export async function getUsers(req, res, next) {
  try {
    const users = await User.find().sort("-createdAt");
    
    // We will count resumes for each user to show in the table
    // Fetch all user IDs to do an aggregate or simple lookup
    // Using a simpler approach: fetch all resumes and group by user
    const resumes = await Resume.aggregate([
      { $group: { _id: "$user", count: { $sum: 1 } } }
    ]);

    const resumeCountMap = {};
    resumes.forEach(r => {
      resumeCountMap[r._id.toString()] = r.count;
    });

    const formattedUsers = users.map(user => {
      const u = user.toSafeJSON();
      u.resumeCount = resumeCountMap[u.id.toString()] || 0;
      return u;
    });

    res.status(200).json({
      success: true,
      users: formattedUsers
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Delete user and their resumes
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export async function deleteUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent deleting oneself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot delete your own admin account" });
    }

    // Delete user's resumes
    await Resume.deleteMany({ user: user._id });
    
    // Delete user
    await User.findByIdAndDelete(user._id);

    res.status(200).json({
      success: true,
      message: "User and their resumes deleted successfully"
    });
  } catch (err) {
    next(err);
  }
}
