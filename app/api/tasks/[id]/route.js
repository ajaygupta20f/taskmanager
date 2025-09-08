import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import { authenticateUser } from '@/lib/auth';
import mongoose from 'mongoose';
export async function GET(request, { params }) {
  try {
    const authResult = await authenticateUser(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    await dbConnect();
    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }
    const task = await Task.findOne({ _id: id, userId: authResult.userId });
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json({ task });
  } catch (error) {
    console.error('Get task error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
export async function PUT(request, { params }) {
  try {
    const authResult = await authenticateUser(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    await dbConnect();
    const { id } = params;
    const { title, description, status } = await request.json();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }
    if (status && !['pending', 'done'].includes(status)) {
      return NextResponse.json(
        { error: 'Status must be either "pending" or "done"' },
        { status: 400 }
      );
    }
    const task = await Task.findOneAndUpdate(
      { _id: id, userId: authResult.userId },
      { title, description, status },
      { new: true, runValidators: true }
    );
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json({
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    console.error('Update task error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
export async function DELETE(request, { params }) {
  try {
    const authResult = await authenticateUser(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    await dbConnect();
    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }
    const task = await Task.findOneAndDelete({ _id: id, userId: authResult.userId });
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json({
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
