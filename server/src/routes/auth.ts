import express from 'express';
import passport from 'passport';
import * as jwt from 'jsonwebtoken';
import { AuthController } from '../controllers/authController';
import { validateRegister, validateLogin } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Traditional authentication routes
router.post('/register', validateRegister, AuthController.register);
router.post('/login', validateLogin, AuthController.login);

// OAuth routes
router.get('/google', 
  (req, res, next) => {
    // Store the mode (login/signup) in session for later use
    const mode = req.query.mode as string;
    if (mode && (mode === 'login' || mode === 'signup')) {
      req.session = req.session || {};
      (req.session as any).authMode = mode;
    }
    next();
  },
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/auth?error=oauth_failed` }),
  (req, res) => {
    // Successful authentication
    const user = req.user as any;
    const authMode = (req.session as any)?.authMode || 'login';
    
    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }
    if (!user || !user.id || !user.email) {
      return res.redirect(`${process.env.CLIENT_URL}/auth?error=oauth_failed`);
    }
    
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      jwtSecret || '',
      { expiresIn: '7d' }
    );

    // Clean up session
    if (req.session) {
      delete (req.session as any).authMode;
    }

    // Redirect to frontend with token and mode info
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}&mode=${authMode}`);
  }
);

// Protected routes
router.get('/profile', authenticateToken, AuthController.getProfile);
router.get('/me', authenticateToken, AuthController.getProfile); // Frontend compatibility
router.put('/profile', authenticateToken, AuthController.updateProfile);
router.put('/change-password', authenticateToken, AuthController.changePassword);

export default router;
