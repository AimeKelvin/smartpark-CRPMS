
# SmartPark CRPMS - National Practical Exam 2025

**Candidate Name:** [FirstName] [LastName]  
**Project:** Car Repair Payment Management System (CRPMS)  
**Location:** Rubavu District, Western Province, Rwanda

## Product Description
The SmartPark CRPMS is a comprehensive web-based application designed to manage car repair services, track service records, process payments, and generate financial reports. It is built to streamline operations for SmartPark mechanics and administrators, ensuring accurate record-keeping and billing.

## Technology Stack
- **Frontend:** React.js, TypeScript, Tailwind CSS, Axios
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Authentication:** Session-based with Bcrypt encryption

## Setup Instructions

### 1. Database Setup
1. Open your MySQL client (e.g., phpMyAdmin, Workbench).
2. Create a new database named `smartpark_crpms`.
3. Import the `backend/database-schema.sql` file to create tables and insert initial data.

### 2. Backend Setup
1. Navigate to the backend folder: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file with your DB credentials (see `.env.example`).
4. Start the server: `npm run dev`
   - Server runs on http://localhost:5000

### 3. Frontend Setup
1. Navigate to the root folder.
2. Install dependencies: `npm install`
3. Start the React app: `npm start`
   - App runs on http://localhost:3000

## Exam Presentation Notes

### Challenges Faced
1. **Strict CRUD Enforcement:** Implementing logic to restrict Update/Delete operations on specific entities (Car, Services, Payment) while allowing full CRUD on ServiceRecord required careful backend route design.
2. **Complex Reporting:** Generating the bill required joining multiple tables (Car, ServiceRecord, Services, Payment) to calculate the balance dynamically.
3. **Session Management:** ensuring secure HTTP-only cookies worked correctly between the React frontend and Express backend required proper CORS configuration.

### Solutions Applied
1. **Middleware & Route Logic:** Created specific API endpoints that only support the allowed HTTP methods for each entity.
2. **SQL Joins:** Used efficient SQL JOIN queries to fetch related data for reports in a single request.
3. **Axios Interceptors:** Configured global interceptors to handle 401 Unauthorized responses and redirect users to login automatically.

---
*This project is submitted for the National Practical Exam 2025.*
