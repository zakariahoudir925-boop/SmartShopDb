const express = require('express');
const router = express.Router();

module.exports = (authService) => {
  // POST /api/auth/login
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email and password are required'
        });
      }

      const result = await authService.login(email, password);
      res.json(result);
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }
  });

  // POST /api/auth/register
  router.post('/register', async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email and password are required'
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          error: 'Password must be at least 6 characters'
        });
      }

      const existingUser = await authService.findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'User already exists'
        });
      }

      const user = await authService.createUser(email, password, 'CLIENT');
      const token = authService.createToken(user.id, user.email, user.role);

      res.status(201).json({
        success: true,
        token,
        user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Registration failed'
      });
    }
  });

  // POST /api/auth/register-admin (créer admin - sécurisé en production)
  router.post('/register-admin', async (req, res) => {
    try {
      const { email, password, adminKey } = req.body;

      if (adminKey !== process.env.ADMIN_KEY) {
        return res.status(403).json({
          success: false,
          error: 'Invalid admin key'
        });
      }

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email and password are required'
        });
      }

      const existingUser = await authService.findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'User already exists'
        });
      }

      const user = await authService.createUser(email, password, 'ADMIN');
      const token = authService.createToken(user.id, user.email, user.role);

      res.status(201).json({
        success: true,
        token,
        user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Admin registration failed'
      });
    }
  });

  return router;
};
