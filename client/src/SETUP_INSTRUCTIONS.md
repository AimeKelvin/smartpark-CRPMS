
# SmartPark CRPMS - Setup Instructions

## Quick Start Guide

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server (v5.7 or higher)
- npm or yarn

### Step 1: Database Setup

1. **Start MySQL Server**
   ```bash
   # On Windows: Start MySQL from Services
   # On Mac: brew services start mysql
   # On Linux: sudo systemctl start mysql
   ```

2. **Create Database**
   ```bash
   mysql -u root -p
   ```
   
   Then run:
   ```sql
   CREATE DATABASE smartpark_crpms;
   ```

3. **Run Schema**
   ```bash
   mysql -u root -p smartpark_crpms < backend/database-schema.sql
   ```

### Step 2: Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file** (in backend directory)
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=smartpark_crpms
   SESSION_SECRET=smartpark_secret_key_2025
   PORT=5000
   ```

4. **Start backend server**
   ```bash
   node server.js
   ```
   
   You should see: `Server running on port 5000`

### Step 3: Frontend Setup

1. **Install dependencies** (in root directory)
   ```bash
   npm install
   ```

2. **Start frontend**
   ```bash
   npm start
   ```
   
   The app will open at `http://localhost:3000`

### Step 4: Load Demo Data

1. **Open the application** at `http://localhost:3000/login`

2. **Click "Load Data" button** to seed the database with demo data
   - This creates the admin user
   - Adds 8 sample cars
   - Adds 14 service records
   - Adds 12 payment records

3. **Click "Auto-fill" button** or manually enter:
   - Username: `admin`
   - Password: `admin123`

4. **Click "Sign In"**

## Troubleshooting

### "Invalid credentials" error
- **Solution**: Click the "Load Data" button first to create the admin user
- Make sure the backend server is running
- Check MySQL connection in backend/.env

### Backend won't start
- Check if MySQL is running: `mysql -u root -p`
- Verify database exists: `SHOW DATABASES;`
- Check backend/.env configuration
- Verify port 5000 is not in use

### Frontend won't connect to backend
- Ensure backend is running on port 5000
- Check browser console for CORS errors
- Verify `src/services/api.ts` has correct baseURL

### Database connection errors
- Verify MySQL credentials in backend/.env
- Check if database `smartpark_crpms` exists
- Ensure MySQL user has proper permissions

## Demo Credentials

After clicking "Load Data":
- **Username**: admin
- **Password**: admin123

## Demo Data Included

- **8 Cars**: Various types (Sedan, SUV, Truck, Pickup)
- **14 Service Records**: Spanning last 30 days
- **12 Payment Records**: Mix of full and partial payments
- **6 Services**: Pre-defined repair services with prices

## Project Structure

```
smartpark-crpms/
├── backend/
│   ├── config/
│   │   └── database.js          # MySQL connection
│   ├── middleware/
│   │   └── auth.js               # Authentication middleware
│   ├── routes/
│   │   ├── auth.js               # Login/logout routes
│   │   ├── car.js                # Car management
│   │   ├── services.js           # Service management
│   │   ├── serviceRecord.js      # Service records
│   │   ├── payment.js            # Payment management
│   │   └── reports.js            # Reports generation
│   ├── database-schema.sql       # Database schema
│   ├── seed-demo-data.js         # Demo data seeder
│   ├── server.js                 # Express server
│   └── package.json
├── src/
│   ├── components/
│   │   ├── ui/                   # Reusable UI components
│   │   ├── Layout.tsx            # App layout
│   │   └── ProtectedRoute.tsx   # Route protection
│   ├── context/
│   │   └── AuthContext.tsx       # Authentication context
│   ├── pages/                    # Application pages
│   ├── services/
│   │   └── api.ts                # Axios configuration
│   ├── types/
│   │   └── index.ts              # TypeScript types
│   └── utils/                    # Utility functions
└── App.tsx                       # Main app component
```

## Features

1. **Authentication**: Secure login with session management
2. **Car Management**: Register and manage vehicles
3. **Service Management**: Define repair services and pricing
4. **Service Records**: Track repairs performed on vehicles
5. **Payment Management**: Record and track payments
6. **Reports**: Generate bills and daily reports

## Support

For issues or questions, check the console logs:
- **Backend logs**: Terminal where `node server.js` is running
- **Frontend logs**: Browser Developer Tools (F12) → Console
