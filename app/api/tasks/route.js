import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import { authenticateUser } from '@/lib/auth';
export async function GET(request) {
  try {
    const authResult = await authenticateUser(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;
    let query = { userId: authResult.userId };
    if (status !== 'all') {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Task.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    return NextResponse.json({
      tasks,
      pagination: {
        currentPage: page,
        totalPages,
        totalTasks: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
export async function POST(request) {
  try {
    const authResult = await authenticateUser(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    await dbConnect();
    const { title, description, status = 'pending' } = await request.json();
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }
    const task = new Task({
      title,
      description,
      status,
      userId: authResult.userId
    });
    await task.save();
    return NextResponse.json({
      message: 'Task created successfully',
      task
    }, { status: 201 });
  } catch (error) {
    console.error('Create task error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
