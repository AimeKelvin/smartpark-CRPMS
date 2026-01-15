
-- SmartPark CRPMS Database Schema
-- National Practical Exam 2025
-- Candidate: [FirstName] [LastName]

CREATE DATABASE IF NOT EXISTS smartpark_crpms;
USE smartpark_crpms;

-- 1. Services Table
-- Rules: ServiceCode is PK
CREATE TABLE IF NOT EXISTS Services (
    ServiceCode VARCHAR(20) PRIMARY KEY,
    ServiceName VARCHAR(100) NOT NULL,
    ServicePrice DECIMAL(10, 2) NOT NULL
);

-- 2. Car Table
-- Rules: PlateNumber is PK
CREATE TABLE IF NOT EXISTS Car (
    PlateNumber VARCHAR(20) PRIMARY KEY,
    Type VARCHAR(50) NOT NULL,
    Model VARCHAR(50) NOT NULL,
    ManufacturingYear INT NOT NULL,
    DriverPhone VARCHAR(20) NOT NULL,
    MechanicName VARCHAR(100) NOT NULL
);

-- 3. User Table
-- For Authentication
CREATE TABLE IF NOT EXISTS User (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    Role VARCHAR(20) DEFAULT 'admin'
);

-- 4. ServiceRecord Table
-- Rules: RecordNumber PK, Links to Car and Services
CREATE TABLE IF NOT EXISTS ServiceRecord (
    RecordNumber INT AUTO_INCREMENT PRIMARY KEY,
    ServiceDate DATE NOT NULL,
    PlateNumber VARCHAR(20) NOT NULL,
    ServiceCode VARCHAR(20) NOT NULL,
    FOREIGN KEY (PlateNumber) REFERENCES Car(PlateNumber),
    FOREIGN KEY (ServiceCode) REFERENCES Services(ServiceCode)
);

-- 5. Payment Table
-- Rules: PaymentNumber PK, Links to Car
CREATE TABLE IF NOT EXISTS Payment (
    PaymentNumber INT AUTO_INCREMENT PRIMARY KEY,
    AmountPaid DECIMAL(10, 2) NOT NULL,
    PaymentDate DATE NOT NULL,
    PlateNumber VARCHAR(20) NOT NULL,
    FOREIGN KEY (PlateNumber) REFERENCES Car(PlateNumber)
);

-- Pre-insert Services (Required by Exam)
INSERT INTO Services (ServiceCode, ServiceName, ServicePrice) VALUES
('SVC001', 'Engine repair', 150000),
('SVC002', 'Transmission repair', 80000),
('SVC003', 'Oil change', 60000),
('SVC004', 'Chain replacement', 40000),
('SVC005', 'Disc replacement', 400000),
('SVC006', 'Wheel alignment', 5000)
ON DUPLICATE KEY UPDATE ServicePrice = VALUES(ServicePrice);

-- ERD Description (As Comments)
/*
ERD Relationships:
1. Car --(1:M)--> ServiceRecord
   - One Car can have multiple Service Records
   - PK: Car.PlateNumber -> FK: ServiceRecord.PlateNumber

2. Services --(1:M)--> ServiceRecord
   - One Service type can be in multiple Service Records
   - PK: Services.ServiceCode -> FK: ServiceRecord.ServiceCode

3. Car --(1:M)--> Payment
   - One Car can have multiple Payments
   - PK: Car.PlateNumber -> FK: Payment.PlateNumber
*/
