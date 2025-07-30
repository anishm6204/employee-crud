
const express = require('express');
const router = express.Router();
const {
  getAllDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
} = require('../controllers/departmentCon');


router.get('/', getAllDepartments);


router.post('/', addDepartment);

router.put('/:id', updateDepartment);

router.delete('/:id', deleteDepartment);

module.exports = router;
