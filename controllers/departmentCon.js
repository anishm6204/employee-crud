const pool = require('../db');


const getAllDepartments = async (req, res) => {
  try {
    const data = await pool.query('SELECT * FROM departments ORDER BY id');
    res.json(data.rows);
  } catch (err) {
    console.log('Error getting departments:', err.message);
    res.status(500).json({ error: 'something went wrong' });
  }
};


const addDepartment = async (req, res) => {
  const { name, location } = req.body;
  try {
    const data = await pool.query(
      'INSERT INTO departments (name, location) VALUES ($1, $2) RETURNING *',
      [name, location]
    );
    res.status(201).json(data.rows[0]);
  } catch (err) {
    console.log('Error adding department:', err.message);
    res.status(500).json({ error: 'could not add department' });
  }
};


const updateDepartment = async (req, res) => {
  const { id } = req.params;
  const { name, location } = req.body;

  try {
    const data = await pool.query(
      'UPDATE departments SET name = $1, location = $2 WHERE id = $3 RETURNING *',
      [name, location, id]
    );
    if (data.rows.length === 0) {
      return res.status(404).json({ error: 'no such department' });
    }
    res.json(data.rows[0]);
  } catch (err) {
    console.log('Update error:', err.message);
    res.status(500).json({ error: 'could not update' });
  }
};


const deleteDepartment = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await pool.query(
      'DELETE FROM departments WHERE id = $1 RETURNING *',
      [id]
    );
    if (data.rows.length === 0) {
      return res.status(404).json({ error: 'department not found' });
    }
    res.json({ message: 'department deleted' });
  } catch (err) {
    console.log('Delete error:', err.message);
    res.status(500).json({ error: 'delete failed' });
  }
};

module.exports = {
  getAllDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
};
