const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const student = await Student.findOne({ _id: decoded.id });

    if (!student) {
      return res.status(401).json({ message: 'Invalid authentication' });
    }

    // Check if student is active
    if (!student.isActive) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }

    req.token = token;
    req.student = student;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.student.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
      }
      next();
    });
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

module.exports = { auth, adminAuth }; 