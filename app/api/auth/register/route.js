import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { signToken } from '@/lib/jwt';
export async function POST(request) {
  try {
    await dbConnect();
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      );
    }
    const user = new User({ email, password });
    await user.save();
    const token = signToken({ userId: user._id });
    return NextResponse.json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        email: user.email
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
