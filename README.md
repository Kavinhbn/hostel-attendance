# 🏨 Hostel Attendance System

## 📌 Overview
The **Hostel Attendance System** is designed to optimize meal planning in hostels by **tracking student attendance** and **adjusting food preparation accordingly**. This prevents **food wastage** and ensures **fair financial adjustments** for students based on their actual meal consumption.

## 🚀 Features
### 🔐 **Authentication**
- **Student & Admin Login** with secure authentication.

### 🎯 **Attendance Tracking**
- **Face Recognition** for automatic meal check-ins.
- **Manual Check-in/Check-out** via the dashboard.

### 📊 **Admin Dashboard**
- **Live Attendance Monitoring**
- **Meal Forecast for Kitchen Staff**
- **Student Leave Management**
- **Analytics & Reports** (weekly/monthly meal consumption)

### 💰 **Financial Adjustments**
- Students receive a **discount** based on missed meals at year-end.

---

## 🏗️ **Project Structure**
```bash
Hostel-Attendance-System/
│── backend/         # Backend (Node.js, Express, MongoDB)
│   ├── models/      # Mongoose Models
│   ├── routes/      # API Routes
│   ├── controllers/ # Business Logic
│   ├── config/      # Database Configuration
│   ├── server.js    # Main Server File
│
│── frontend/        # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/  # Reusable UI Components
│   │   ├── pages/       # React Pages (Login, Dashboard, Attendance)
│   │   ├── App.js       # Main App Component
│   │   ├── index.js     # Entry Point
│
│── README.md        # Project Documentation
│── package.json     # Dependencies & Scripts
│── .env             # Environment Variables

