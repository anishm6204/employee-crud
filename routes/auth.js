const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

//managers have all permissions and employees have limited permissions

const users = [
  {
    id: 1,
    username: 'manager1',
    password: bcrypt.hashSync('manager123', 10),
    role: 'manager'
  },
  {
    id: 2,
    username: 'employee1',
    password: bcrypt.hashSync('employee123', 10),
    role: 'employee'
  }
];

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
});

module.exports = router;
