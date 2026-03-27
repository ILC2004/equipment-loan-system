Equipment Loan Management System

This is a full-stack system for managing equipment loans in a college environment.
Users can request equipment, and admins manage approvals, returns, and availability.

Features:

User login (student, staff, admin)
View and search equipment
Request bookings with selected dates
Admin approval or rejection of bookings
Return and cleaning workflow (disinfecting → available)
Tech Stack

Frontend

React (Vite)
Axios

Backend

Node.js
Express.js
JWT
bcrypt

Database

MySQL (XAMPP)


How It Works:

User logs in
Selects equipment and dates
Booking is created as pending
Admin approves or rejects
Item is returned and cleaned before reuse

Run Project:

Backend

cd server
npm install
npm start

Frontend

cd client
npm install
npm run dev

Project Structure
equipment-loan-system/
  client/
  server/