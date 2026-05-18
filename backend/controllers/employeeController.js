const Employee = require('../models/Employee');

// Add new employee
exports.addEmployee = async (req, res, next) => {
  try {
    const { name, email, department, skills, performanceScore, experience } = req.body;

    // If candidate, link to their user account and ensure they don't already have a profile
    if (req.user.role === 'candidate') {
      const existing = await Employee.findOne({ userId: req.user.userId });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'You already have a profile. Use update instead.'
        });
      }
    }

    // Create new employee
    const employee = new Employee({
      name,
      email,
      department,
      skills,
      performanceScore,
      experience,
      userId: req.user.role === 'candidate' ? req.user.userId : null
    });

    await employee.save();

    res.status(201).json({
      success: true,
      message: 'Employee added successfully',
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

// Get all employees (HR only — enforced by route middleware)
exports.getAllEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    next(error);
  }
};

// Get own profile (for candidates)
exports.getMyProfile = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ userId: req.user.userId });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found. Please create your profile first.'
      });
    }

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

// Get employee by ID
exports.getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Candidates can only view their own profile
    if (req.user.role === 'candidate' && String(employee.userId) !== String(req.user.userId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own profile.'
      });
    }

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

// Search employees
exports.searchEmployees = async (req, res, next) => {
  try {
    const { department, name, minScore, maxScore } = req.query;
    let query = {};

    if (department) {
      query.department = department;
    }

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    if (minScore || maxScore) {
      query.performanceScore = {};
      if (minScore) query.performanceScore.$gte = Number(minScore);
      if (maxScore) query.performanceScore.$lte = Number(maxScore);
    }

    const employees = await Employee.find(query).sort({ performanceScore: -1 });

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    next(error);
  }
};

// Update employee
exports.updateEmployee = async (req, res, next) => {
  try {
    const { name, email, department, skills, performanceScore, experience } = req.body;

    // Candidates can only update their own profile
    if (req.user.role === 'candidate') {
      const employee = await Employee.findById(req.params.id);
      if (!employee || String(employee.userId) !== String(req.user.userId)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only update your own profile.'
        });
      }
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { name, email, department, skills, performanceScore, experience },
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

// Delete employee
exports.deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
