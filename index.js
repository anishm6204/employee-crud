
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;



const pool = require('./db');

// middlewares
app.use(cors());
app.use(express.json());
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);


//routes
const departmentRoutes = require('./routes/departmentRoutes');
const employeeRoutes = require('./routes/employeeRoutes'); 
app.use('/api/employees', employeeRoutes); 
app.use('/api/departments', departmentRoutes);



app.get('/', (req, res) => {
  res.send('Employee API is live!');
});


app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ time: result.rows[0].now });
  } catch (err) {
    console.error('DB connection error:', err);  // 👈 this logs full error
    res.status(500).json({ error: 'something went wrong' });
  }
});




app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
