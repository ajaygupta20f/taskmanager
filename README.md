# Task Management Web App

A full-stack task management application built with Next.js 14, MongoDB, and JWT authentication. Users can register, log in, and manage their personal tasks with full CRUD operations, search, filtering, and pagination.

## Features

### Authentication
- ✅ User registration with email and password
- ✅ Secure login with JWT tokens
- ✅ Password hashing with bcrypt
- ✅ Protected routes and user-specific data access

### Task Management (CRUD)
- ✅ Create new tasks with title, description, and status
- ✅ View all user tasks with pagination
- ✅ Update existing tasks (title, description, status)
- ✅ Delete tasks with confirmation
- ✅ Toggle task status (pending/done) with one click

### Search, Filter, and Pagination
- ✅ Search tasks by title or description
- ✅ Filter tasks by status (All, Pending, Done)
- ✅ Combined search and filter functionality
- ✅ Pagination with 10 tasks per page
- ✅ Task count and page navigation

### Frontend
- ✅ Built with Next.js 14 App Router
- ✅ Clean and minimal UI with TailwindCSS
- ✅ Responsive design for mobile and desktop
- ✅ Loading states and error handling
- ✅ User-friendly forms with validation

## Tech Stack

- **Frontend**: Next.js 14, React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens, bcrypt for password hashing
- **Styling**: TailwindCSS

## Prerequisites

Before running this application, make sure you have:

- Node.js 18+ installed
- MongoDB installed locally or MongoDB Atlas account
- Git (for cloning the repository)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
MONGODB_URI=mongodb://localhost:27017/task-management
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
JWT_SECRET=your-jwt-secret-key-here
```

### Environment Variables Explanation

- `MONGODB_URI`: Your MongoDB connection string
  - For local MongoDB: `mongodb://localhost:27017/task-management`
  - For MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/task-management`
- `NEXTAUTH_URL`: The base URL of your application (use `http://localhost:3000` for local development)
- `NEXTAUTH_SECRET`: A random secret key for NextAuth (generate with `openssl rand -base64 32`)
- `JWT_SECRET`: A secret key for JWT token signing (generate with `openssl rand -base64 32`)

## Installation and Setup

1. **Clone the repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd task-management-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Copy the environment variables above into a `.env.local` file
   - Replace the placeholder values with your actual configuration

4. **Start MongoDB**:
   - If using local MongoDB: Make sure MongoDB is running on your system
   - If using MongoDB Atlas: Ensure your connection string is correct and your IP is whitelisted

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Getting Started
1. Visit the application at `http://localhost:3000`
2. You'll be redirected to the login page
3. Click "create a new account" to register
4. Fill in your email and password (minimum 6 characters)
5. After registration, you'll be automatically logged in and redirected to the dashboard

### Managing Tasks
1. **Create a Task**: Click "Create New Task" button on the dashboard
2. **View Tasks**: All your tasks are displayed on the dashboard with their status
3. **Search Tasks**: Use the search bar to find tasks by title or description
4. **Filter Tasks**: Use the status buttons (All, Pending, Done) to filter tasks
5. **Update Task Status**: Click the checkbox next to a task to toggle between pending/done
6. **Edit Task**: Click the "Edit" link next to any task to modify it
7. **Delete Task**: Click the "Delete" link and confirm to remove a task

### Navigation
- **Dashboard**: View and manage all your tasks
- **Create Task**: Add a new task
- **Edit Task**: Modify an existing task
- **Logout**: Sign out of your account

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Tasks
- `GET /api/tasks` - Get all tasks for authenticated user (with search, filter, pagination)
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/[id]` - Get a specific task
- `PUT /api/tasks/[id]` - Update a specific task
- `DELETE /api/tasks/[id]` - Delete a specific task

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.js
│   │   │   └── register/route.js
│   │   └── tasks/
│   │       ├── route.js
│   │       └── [id]/route.js
│   ├── dashboard/
│   │   └── page.js
│   ├── login/
│   │   └── page.js
│   ├── register/
│   │   └── page.js
│   ├── tasks/
│   │   ├── new/page.js
│   │   └── [id]/edit/page.js
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── contexts/
│   └── AuthContext.js
├── lib/
│   ├── auth.js
│   ├── jwt.js
│   └── mongodb.js
├── models/
│   ├── Task.js
│   └── User.js
└── README.md
```

## Database Schema

### User Model
```javascript
{
  email: String (required, unique),
  password: String (required, hashed),
  timestamps: true
}
```

### Task Model
```javascript
{
  title: String (required, max 100 chars),
  description: String (required, max 500 chars),
  status: String (enum: ['pending', 'done'], default: 'pending'),
  userId: ObjectId (required, ref: 'User'),
  timestamps: true
}
```

## Security Features

- Passwords are hashed using bcrypt with salt rounds of 12
- JWT tokens are used for authentication with 7-day expiration
- API routes are protected with authentication middleware
- Users can only access their own tasks
- Input validation on both client and server side
- SQL injection protection through Mongoose ODM

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Features

1. **API Routes**: Add new routes in the `app/api/` directory
2. **Pages**: Create new pages in the `app/` directory
3. **Components**: Add reusable components (create a `components/` directory if needed)
4. **Database Models**: Add new models in the `models/` directory

## Deployment

### Vercel Deployment

1. Push your code to a Git repository (GitHub, GitLab, Bitbucket)
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for all IPs in development)
5. Get your connection string and update `MONGODB_URI`

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Ensure MongoDB is running locally or your Atlas connection string is correct
   - Check if your IP is whitelisted in MongoDB Atlas

2. **Authentication Issues**:
   - Verify your JWT_SECRET is set in environment variables
   - Clear browser localStorage if you're having login issues

3. **Build Errors**:
   - Make sure all environment variables are set
   - Run `npm install` to ensure all dependencies are installed

4. **API Route Issues**:
   - Check browser network tab for error details
   - Verify authentication headers are being sent

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).