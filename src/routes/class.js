const express = require('express');
const router = express.Router();
const ClassModel = require('../app/models/Class');

router.get('/lop', async (req, res) => {
    try {
      const classes = await ClassModel.find().populate('faculty').lean();
      res.render('lop', {classes});
    } catch (err) {
      console.error('Lỗi khi lấy dữ liệu lớp:', err);
      res.status(500).send('Lỗi server');
    }
  });

module.exports = router;