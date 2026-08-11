# LincolnX - Game Installer Platform

A modern game installer platform with license key authentication, built with React and Express.

## Project Structure

```
project-root/
├── backend/                # Express.js API Server
│   ├── controllers/        # Business logic
│   │   ├── licenseController.js
│   │   ├── gameController.js
│   │   └── authController.js
│   ├── models/             # MongoDB schemas
│   │   ├── LicenseKey.js
│   │   ├── User.js
│   │   └── Game.js
│   ├── routes/             # API endpoints
│   │   ├── licenseRoutes.js
│   │   ├── gameRoutes.js
│   │   └── authRoutes.js
│   ├── server.js           # Main server file
│   ├── package.json
│   └── .env.example
│
├── client/                 # Public-facing React app
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── LoginModal.jsx
│   │   │   ├── WelcomeModal.jsx
│   │   │   └── TutorialModal.jsx
│   │   ├── App.jsx         # Main app component
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── admin/                  # Admin panel React app
│   ├── src/
│   │   ├── App.jsx         # Admin dashboard
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Admin styles
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── database/               # MongoDB database
    └── (Data stored in MongoDB)
```

## Features

### Client (Public Website)
- 🎮 Game catalog with category filtering
- 🔍 Search functionality
- 🔐 License key authentication
- 🌓 Dark/Light theme toggle
- 📱 Responsive design
- ⬇️ Direct download links

### Admin Panel
- 📊 Real-time statistics dashboard
- 🔑 License key generator
- ➕ Add/Edit/Delete games
- 📋 Game management with filtering
- 📈 View and pick counters

### Backend API
- 🔒 JWT authentication
- 🎫 License key validation
- 🎮 Game CRUD operations
- 📊 Statistics endpoints
- 🔗 CORS enabled for both client and admin

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### 1. Clone and Setup

```bash
# Install backend dependencies
cd backend
npm install

# Install client dependencies
cd ../client
npm install

# Install admin dependencies
cd ../admin
npm install
```

### 2. Environment Configuration

```bash
# Copy backend environment file
cd backend
cp .env.example .env

# Edit .env with your configuration
# - Set MONGODB_URI to your MongoDB connection string
# - Change JWT_SECRET to a secure random string
# - Update CLIENT_URL and ADMIN_URL if needed
```

### 3. Database Setup

```bash
# Make sure MongoDB is running
# Then import the games data (optional - for existing data)
cd backend
node scripts/import-games.js
```

### 4. Run the Application

```bash
# Terminal 1 - Start backend server
cd backend
npm run dev
# Server runs on http://localhost:5000

# Terminal 2 - Start client
cd client
npm run dev
# Client runs on http://localhost:3000

# Terminal 3 - Start admin panel
cd admin
npm run dev
# Admin runs on http://localhost:3001
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Authenticate with license key
- `GET /api/auth/verify` - Verify JWT token

### Games
- `GET /api/games` - Get all games (with optional category filter)
- `GET /api/games/stats` - Get game statistics
- `GET /api/games/:id` - Get single game
- `POST /api/games` - Create game (Admin)
- `PUT /api/games/:id` - Update game (Admin)
- `DELETE /api/games/:id` - Delete game (Admin)

### License Keys
- `POST /api/licenses/generate` - Generate new license key
- `POST /api/licenses/validate` - Validate license key
- `GET /api/licenses` - Get all license keys (Admin)
- `DELETE /api/licenses/:id` - Delete license key (Admin)
- `PUT /api/licenses/:id/deactivate` - Deactivate license key (Admin)

## License Key Format

License keys follow the format: `LX-XXXX-XXXX-XXXX`
- LX prefix for LincolnX branding
- 16 random alphanumeric characters
- Stored in MongoDB with PC binding

## Owner Bypass

Special owner bypass format: `OWNER-username-password`
- Bypasses license validation
- Creates owner-level access
- Configure credentials in authController.js

## Technology Stack

### Frontend
- React 18
- Vite (Build tool)
- Axios (HTTP client)
- React Router DOM (Routing)

### Backend
- Express.js
- MongoDB (Database)
- Mongoose (ODM)
- JWT (Authentication)
- Bcrypt (Password hashing)

## Development

### Adding New Features

1. **Backend**: Create controller → route → test with Postman/Thunder Client
2. **Client**: Create component → integrate in App.jsx
3. **Admin**: Add functionality to admin App.jsx

### Database Schema

#### LicenseKey
- key: String (unique)
- pcId: String
- isOwner: Boolean
- isActive: Boolean
- createdAt: Date
- lastUsed: Date

#### Game
- name: String (unique)
- category: String (enum)
- size: Number
- url: String
- img: String
- views: Number
- picks: Number
- isNew: Boolean
- createdAt: Date

#### User
- username: String (unique)
- password: String (hashed)
- role: String (admin/user)
- createdAt: Date

## Production Deployment

1. Set NODE_ENV=production in .env
2. Use strong JWT_SECRET
3. Configure MongoDB Atlas or production MongoDB
4. Update CORS origins in server.js
5. Build frontend apps: `npm run build`
6. Use PM2 or similar for process management

## Security Notes

- Change JWT_SECRET in production
- Use HTTPS in production
- Implement rate limiting for API endpoints
- Add admin authentication middleware
- Validate and sanitize all inputs
- Use environment variables for sensitive data

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check connection string in .env
- Verify network/firewall settings

### Port Already in Use
- Change ports in vite.config.js files
- Or stop the process using the port

### CORS Errors
- Verify CLIENT_URL and ADMIN_URL in .env
- Check CORS configuration in server.js

## License

This project is proprietary software. All rights reserved.

## Support

For issues or questions, contact the development team.