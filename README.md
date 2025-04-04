# Hostel Attendance System

A comprehensive system for managing hostel mess attendance, meal forecasting, and financial tracking.

## Features

- **Face Recognition Attendance**: Automated attendance marking using face recognition technology
- **Meal Forecasting**: Predict meal attendance to optimize food preparation
- **Leave Management**: Track student leaves and adjust meal planning accordingly
- **Financial Tracking**: Monitor savings and calculate refunds based on attendance
- **Real-time Analytics**: Dashboard with key metrics and trends
- **Responsive Design**: Mobile-friendly interface for all devices

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Face Recognition API

### Frontend
- React
- Vite
- Tailwind CSS
- Headless UI
- Heroicons
- Axios
- React Router
- React Toastify

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/hostel-attendance-system.git
cd hostel-attendance-system
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/hostel-attendance
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
NODE_ENV=development
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
hostel-attendance/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

## API Endpoints

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

### Students
- GET /api/students
- POST /api/students
- GET /api/students/:id
- PUT /api/students/:id
- DELETE /api/students/:id

### Attendance
- GET /api/attendance
- POST /api/attendance
- GET /api/attendance/:id
- PUT /api/attendance/:id

### Meals
- GET /api/meals
- POST /api/meals
- GET /api/meals/forecast
- PUT /api/meals/:id

### Leaves
- GET /api/leaves
- POST /api/leaves
- PUT /api/leaves/:id
- DELETE /api/leaves/:id

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB](https://www.mongodb.com/)
- [Express.js](https://expressjs.com/)
