# crudInReact
CRUD Operation In React with .Net as backend, SQL Server as Database and React as Frontend


React and .NET 8 CRUD Application with JWT Authentication
This project is a full-stack web application consisting of a .NET 8 Web API backend and a React frontend. The backend handles CRUD operations for courses and uses JWT (JSON Web Token) authentication with role-based routing for user access. The frontend communicates with the API to display course data and provides login functionality with JWT.

Features
Backend (API):

Built with .NET 8

CRUD operations for courses

Custom JWT authentication

Role-based routing using isAdmin flag for admin access

Frontend (React):

Login page with JWT authentication

Role-based route protection based on the isAdmin flag

Fetching and displaying course data from the backend

Handling authentication state with React context

Prerequisites
.NET 8 SDK

Node.js (for React)

npm (for managing React dependencies)

Setup Instructions
Backend Setup (.NET 8 Web API)
Clone the backend repository:

bash
Copy
Edit
git clone <repository-url>
cd <backend-directory>
Install dependencies and build the project:

bash
Copy
Edit
dotnet restore
dotnet build
Set up the database connection string in the appsettings.json file.

Run the backend:

bash
Copy
Edit
dotnet run
The backend API will be available at http://localhost:5000.

Frontend Setup (React)
Clone the frontend repository:

bash
Copy
Edit
git clone <repository-url>
cd <frontend-directory>
Install dependencies:

bash
Copy
Edit
npm install
Set the API URL in the .env file:

bash
Copy
Edit
REACT_APP_API_URL=http://localhost:5000
Run the frontend:

bash
Copy
Edit
npm start
The frontend will be available at http://localhost:3000.

Folder Structure
Backend (.NET 8)
markdown
Copy
Edit
- Controllers/
  - CourseController.cs
  - AuthController.cs
- Services/
  - CourseService.cs
  - AuthService.cs
- Repositories/
  - ICourseRepository.cs
  - CourseRepository.cs
- Models/
  - Course.cs
  - User.cs
- JWT/
  - JwtHelper.cs
- Startup.cs
- appsettings.json
Frontend (React)
markdown
Copy
Edit
- src/
  - components/
    - Login.js
    - CourseList.js
  - context/
    - AuthContext.js
  - services/
    - api.js
  - App.js
  - index.js
- .env

JWT Authentication
Login: Users can log in via the /api/auth/login endpoint, which returns a JWT token upon successful authentication.

Authorization: The isAdmin flag is used for role-based routing. Admin users can access protected routes.

Sample API Endpoints
POST /api/auth/login: Logs in a user and returns a JWT token.

GET /api/courses: Retrieves all courses (requires JWT).

POST /api/courses: Adds a new course (requires JWT with admin privileges).

PUT /api/courses/{id}: Updates an existing course (requires JWT with admin privileges).

DELETE /api/courses/{id}: Deletes a course (requires JWT with admin privileges).

Authentication Flow
Login: When a user logs in, a JWT token is generated and sent to the frontend.

Storing Token: The token is stored in localStorage in the frontend.

Making Requests: The token is included in the Authorization header for API requests that require authentication.

Role-based Routing: Protected routes are accessible only to users with the isAdmin flag set to true.



Summary for Your LMS Case
Concept	Your LMS Example
Role-Based Access Control	Admin vs User roles
Data Partitioning	Admins see their own courses; users see enrolled
Claims-Based Authorization	JWT token carries isAdmin and userId claims
Attribute-Based Access Control	Admin can only modify courses they created (ownership)
