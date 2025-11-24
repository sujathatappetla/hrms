**🚀 HRMS (Human Resource Management System) – Structured Overview**
**1. Project Setup Instructions**
📌 Clone Project
git clone https://github.com/your-repo/hrms.git
cd hrms

**2. Backend Setup**
📦 2.1 Install dependencies
cd backend
npm install

📦 2.2 Configure environment variables

Create .env file:

PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=hrms_db
DB_DIALECT=mysql
JWT_SECRET=some_super_secret_key

**3. Database Setup (MySQL + Sequelize)**
🛢 3.1 Create database
CREATE DATABASE hrms_db;

🛢 3.2 Run migrations
npx sequelize-cli db:migrate


Tables created:

organisations

users

employees

teams

employee_teams

logs

🛢 3.3 Seed database
npx sequelize-cli db:seed:all


Creates:

Test Organisation

Admin User

**4. Start Backend**
npm run dev


Backend URL:
👉 http://localhost:5000

**5. Frontend Setup**
🎨 5.1 Install dependencies
cd ../frontend
npm install

🎨 5.2 Start React App
npm start


Frontend URL:
👉 http://localhost:3000

**6. Authentication Flow**
🔑 1️⃣ Register Organisation

POST → /api/auth/register

Body:

{
  "orgName": "MyOrg",
  "adminName": "Admin",
  "email": "admin@org.com",
  "password": "admin123"
}


Response:

{
  "message": "Registered Successfully",
  "token": "JWT_TOKEN_HERE"
}

🔑 2️⃣ Login

POST → /api/auth/login

Body:

{
  "email": "admin@org.com",
  "password": "admin123"
}


Response:

{
  "message": "Login successful",
  "token": "JWT_TOKEN"
}


➡️ Token required for all protected APIs.

**7. Core API Routes**
👥 Employees
Method	Endpoint	Description
GET	/api/employees	List employees
GET	/api/employees/:id	Get employee
POST	/api/employees	Create employee
PUT	/api/employees/:id	Update employee
DELETE	/api/employees/:id	Delete employee
👥 Teams
Method	Endpoint	Description
GET	/api/teams	List teams
POST	/api/teams	Create team
PUT	/api/teams/:id	Update team
DELETE	/api/teams/:id	Delete team
👥 Team Assignment
Method	Endpoint	Body	Description
POST	/api/teams/:teamId/assign	{ employeeId }	Assign employee
DELETE	/api/teams/:teamId/unassign	{ employeeId }	Remove assignment
**8. Logging (Audit Trail)**

Log Entry Examples:

[TIME] User '3' created employee 12

[TIME] User '3' updated team 7

[TIME] User '3' assigned employee 12 → team 4

[TIME] User '3' deleted employee 12

[TIME] User '3' logged in

**9. Frontend Pages**
Route	Description
/auth/register	Register Organisation
/auth/login	Login
/dashboard	Dashboard
/employees	Employee CRUD
/teams	Team CRUD
/assign	Assign employees to teams

Includes:

Forms

Tables

Protected routes

localStorage token

Axios wrapper (injects token)

**10. Deployment Instructions**
🛠 Backend Deployment (Render.com)

Steps:

Push backend to GitHub

Connect Render project

Add environment variables

Deploy & check logs

Run migrations:

npx sequelize-cli db:migrate


Run seeds (optional):

npx sequelize-cli db:seed:all

🎯 Frontend Deployment (Vercel)

Steps:

Build frontend:

npm run build


Deploy using Vercel
