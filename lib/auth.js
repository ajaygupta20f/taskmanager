import { verifyToken, getTokenFromRequest } from './jwt';
import dbConnect from './mongodb';
import User from '@/models/User';
export async function authenticateUser(request) {
  try {
    await dbConnect();
    const token = getTokenFromRequest(request);
    if (!token) {
      return { error: 'No token provided', status: 401 };
    }
    const decoded = verifyToken(token);
    if (!decoded) {
      return { error: 'Invalid token', status: 401 };
    }
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return { error: 'User not found', status: 401 };
    }
    return { user, userId: user._id.toString() };
  } catch (error) {
    console.error('Authentication error:', error);
    return { error: 'Authentication failed', status: 500 };
  }
}
