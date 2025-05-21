crudInReact
CRUD Operation In React with .NET 8 backend, SQL Server as Database, and React as Frontend

React and .NET 8 CRUD Application with JWT Authentication
This project is a full-stack web application consisting of a .NET 8 Web API backend and a React frontend. It handles:

CRUD operations for courses

Secure login and authentication using JWT

Role-based access control using an isAdmin flag

Admins can assign courses to users

Users can view only their assigned courses

 Features
 Backend (API - .NET 8)
Built with .NET 8 Web API

CRUD operations for courses

Custom JWT authentication

Role-based access using isAdmin

Admin can assign specific courses to users

GET /api/course/my-courses endpoint for user-specific course data

 Frontend (React)
JWT-based login system

Authentication state managed with React Context

Role-based routing: Admin vs User dashboards

Users see only assigned courses, Admins see all courses

React Bootstrap UI

Unit testing with Vitest + React Testing Library

 Prerequisites
.NET 8 SDK

Node.js

npm or yarn

 Setup Instructions
 Backend Setup (.NET 8 Web API)
Clone the backend repository

bash
Copy
Edit
git clone <backend-repo-url>
cd <backend-folder>
Restore and build

bash
Copy
Edit
dotnet restore
dotnet build
Configure database in appsettings.json

Run the API

bash
Copy
Edit
dotnet run
Backend will run at: https://localhost:7226 (or based on HTTPS port)

Frontend Setup (React)
Clone the frontend repository

bash
Copy
Edit
git clone <frontend-repo-url>
cd <frontend-folder>
Install dependencies

bash
Copy
Edit
npm install
Run the frontend

bash
Copy
Edit
npm run dev
Frontend will run at: https://localhost:50002 or configured Vite dev port

 Folder Structure
 Backend (ASP.NET Core)
markdown
Copy
Edit
- Controllers/
  - CourseController.cs
  - AuthController.cs
  - AssignmentController.cs
- Services/
  - CourseService.cs
  - AuthService.cs
  - AssignmentService.cs
- Repositories/
  - Interfaces/
    - ICourseRepository.cs
    - IUserRepository.cs
    - IAssignmentRepository.cs
  - Implementations/
    - CourseRepository.cs
    - UserRepository.cs
    - AssignmentRepository.cs
- Models/
  - Course.cs
  - User.cs
  - Assignment.cs
- JWT/
  - JwtHelper.cs
- appsettings.json
- Program.cs

 Frontend (React + Vite)
markdown
Copy
Edit
- src/
  - components/
    - Login.js
    - AdminDashboard.js
    - UserDashboard.js
    - AssignCourse.js
  - context/
    - AuthContext.js
  - api/
    - authService.js
    - courseService.js
    - assignmentService.js
  - tests/
    - Login.test.jsx
    - UserDashboard.test.jsx
  - App.jsx
  - main.jsx
- vite.config.js
- .env

JWT Authentication & Role-based Access
Auth Flow
Login: POST /api/auth/login returns JWT

Store Token: Saved to localStorage

Authenticated Requests: Token passed in Authorization header

Routing:

Admins: Full access

Users: Can only see assigned courses

 Key API Endpoints
Method	Endpoint	Description	Access
POST	/api/auth/login	Logs in and returns JWT	Public
GET	/api/course	Get all courses	Authenticated
POST	/api/course	Create a course	Admin only
PUT	/api/course/{id}	Update course	Admin only
DELETE	/api/course/{id}	Delete course	Admin only
GET	/api/course/my-courses	Get assigned courses for current user	Authenticated
POST	/api/course/assign	Assign a course to a user	Admin only

 Unit Testing
Tools
Vitest

React Testing Library

Run Tests
bash
Copy
Edit
npm run test

 Summary for LMS Use Case
Concept	Your LMS Example
Role-Based Access Control	Admin vs User roles
Data Partitioning	Users only see assigned courses
Claims-Based Authorization	JWT token holds isAdmin and userId
Attribute-Based Access Control	Admin can only modify content they own

