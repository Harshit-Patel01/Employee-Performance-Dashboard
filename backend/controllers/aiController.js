const axios = require('axios');
const Employee = require('../models/Employee');

// AI Recommendation
exports.getRecommendation = async (req, res, next) => {
  try {
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID is required'
      });
    }

    // Fetch employee data
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Prepare AI prompt
    const prompt = `Analyze this employee profile and provide recommendations:

Employee Name: ${employee.name}
Department: ${employee.department}
Skills: ${employee.skills.join(', ')}
Performance Score: ${employee.performanceScore}/100
Years of Experience: ${employee.experience}

Please provide:
1. Promotion Recommendation (Yes/No with reasoning)
2. Training Suggestions (specific courses or skills to develop)
3. Overall Performance Feedback
4. Career Growth Suggestions

Format the response in a structured way.`;

    // Call AI API
    const aiResponse = await axios.post(
      process.env.AI_API_URL,
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an HR expert providing employee performance analysis and recommendations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.AI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const recommendation = aiResponse.data.choices[0].message.content;

    res.status(200).json({
      success: true,
      employee: {
        id: employee._id,
        name: employee.name,
        department: employee.department,
        performanceScore: employee.performanceScore
      },
      recommendation
    });
  } catch (error) {
    console.error('AI API Error:', error.response?.data || error.message);
    next(error);
  }
};

// Rank employees
exports.rankEmployees = async (req, res, next) => {
  try {
    const { department } = req.query;

    let query = {};
    if (department) {
      query.department = department;
    }

    // Get employees sorted by performance score
    const employees = await Employee.find(query)
      .sort({ performanceScore: -1, experience: -1 })
      .select('name email department performanceScore experience skills');

    // Add rank
    const rankedEmployees = employees.map((emp, index) => ({
      rank: index + 1,
      ...emp.toObject()
    }));

    res.status(200).json({
      success: true,
      count: rankedEmployees.length,
      data: rankedEmployees
    });
  } catch (error) {
    next(error);
  }
};

// Batch recommendations
exports.getBatchRecommendations = async (req, res, next) => {
  try {
    const { department, minScore } = req.query;

    let query = {};
    if (department) query.department = department;
    if (minScore) query.performanceScore = { $gte: Number(minScore) };

    const employees = await Employee.find(query).limit(10);

    const recommendations = employees.map(emp => {
      let recommendation = '';

      if (emp.performanceScore >= 85) {
        recommendation = 'Promotion Recommended - Excellent performance';
      } else if (emp.performanceScore >= 70) {
        recommendation = 'Good performance - Consider for advanced training';
      } else if (emp.performanceScore >= 50) {
        recommendation = 'Average performance - Needs skill improvement training';
      } else {
        recommendation = 'Below average - Requires immediate performance improvement plan';
      }

      return {
        employeeId: emp._id,
        name: emp.name,
        department: emp.department,
        performanceScore: emp.performanceScore,
        recommendation
      };
    });

    res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations
    });
  } catch (error) {
    next(error);
  }
};
