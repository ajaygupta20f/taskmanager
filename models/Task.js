import mongoose from 'mongoose';
const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a task title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a task description'],
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'done'],
    default: 'pending'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});
TaskSchema.index({ userId: 1, createdAt: -1 });
TaskSchema.index({ userId: 1, status: 1 });
TaskSchema.index({ userId: 1, title: 'text', description: 'text' });
export default mongoose.models.Task || mongoose.model('Task', TaskSchema);
