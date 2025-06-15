//const { populate } = require("../models/user");

exports.create = (Model) => async (req, res) => {
    try {
      const doc = new Model(req.body);
      const saved = await doc.save();
      res.status(201).json(saved);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  
  exports.getAll = (Model, populateFields = []) => async (req, res) => {
    try {
      let query = Model.find();
      populateFields.forEach(field => {
        query = query.populate(field);
      });
      const docs = await query.exec();
      res.json(docs);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  exports.getOne = (Model, populateFields = []) => async (req, res) => {
    try {
      let query = Model.findById(req.params.id);
      populateFields.forEach(field => {
        query = query.populate(field);
      });
      const doc = await query.exec();
      if (!doc) return res.status(404).json({ message: 'Not found' });
      res.json(doc);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  exports.update = (Model) => async (req, res) => {
    try {
      const updated = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updated) return res.status(404).json({ message: 'Not found' });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  
  exports.remove = (Model) => async (req, res) => {
    try {
      const deleted = await Model.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Not found' });
      res.json({ message: 'Đã xóa thành công!!!' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };