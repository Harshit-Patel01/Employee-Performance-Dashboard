const Employee = require('../models/Employee');

// Add new employee
exports.addEmployee = async (req, res, next) => {
  try {
    const { name, email, department, skills, performanceScore, experience } = req.body;

    // Create new employee
    const employee = new Employee({
      name,
      email,
      department,
      skills,
      performanceScore,
      experience
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

// Get all employees
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
