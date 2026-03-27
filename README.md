# Equipment Loan Management System

Full-stack system for managing equipment loans in a college environment. Users can request equipment, while administrators manage approvals, returns, and availability.

## Technologies

Frontend: React (Vite), Axios
Backend: Node.js, Express.js, JWT, bcrypt
Database: MySQL (XAMPP / MariaDB)

## Features

* User authentication (student, staff, admin)
* Equipment browsing and search
* Booking system with approval workflow
* Loan lifecycle: pending → approved → returned → disinfecting → available
* Equipment management (admin)
* Availability tracking (unavailable dates shown)

## Key Rules

* Max 14-day booking
* Max 3 active bookings per user (pending or approved)
* No overlapping bookings
* 1-day disinfecting buffer after return

## How to Run

1. Start database
   Open XAMPP → start MySQL → go to http://localhost/phpmyadmin → import:
   database/equipment_loan_db.sql

2. Start backend
   cd server
   npm install
   node server.js

Runs on: http://localhost:5000

3. Start frontend
   cd client
   npm install
   npm run dev

Runs on: http://localhost:5173

## Demo Steps

1. Login as student
2. Browse equipment
3. Create booking
4. Login as admin
5. Approve booking
6. Return item
7. Mark as cleaned

## Project Structure

equipment-loan-system/
client/
server/
database/
README.md

## Notes

* node_modules is excluded (recreated with npm install)
* Uses client-server architecture (frontend ↔ backend ↔ database)
* Designed as a prototype with simplified workflow
