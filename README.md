
# SmartPark CRPMS

**Candidate Name:** Aime Kelvin Shimwa  
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
   - Server runs on http://localhost:2026

### 3. Frontend Setup
1. Navigate to the root folder.
2. Install dependencies: `npm install`
3. Start the React app: `npm start`
   - App runs on http://localhost:3000


