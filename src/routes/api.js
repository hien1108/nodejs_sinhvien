const express = require('express');
const router = express.Router();
const Student = require('../app/models/student');
const Teacher = require('../app/models/Teacher');

router.get('/chart-data', async (req, res) => {
  try {
    const data = {
      student: {
        CNTT: await Student.countDocuments({ major: 'CNTT' }),
        HTTT: await Student.countDocuments({ major: 'HTTT' }),
        KHMT: await Student.countDocuments({ major: 'KHMT' }),
      },
      teacher: {
        CNTT: await Teacher.countDocuments({ major: 'CNTT' }),
        HTTT: await Teacher.countDocuments({ major: 'HTTT' }),
        KHMT: await Teacher.countDocuments({ major: 'KHMT' }),
      },
    };
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
