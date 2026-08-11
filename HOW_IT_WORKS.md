# How LincolnX Works - System Architecture

## Overview

LincolnX is a three-tier application consisting of:
1. **Backend API** - Central server handling all business logic and database operations
2. **Client App** - Public-facing website for users to browse and download games
3. **Admin Panel** - Management interface for administrators to manage games and license keys

---

## System Architecture

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Client    │      │    Admin    │      │  Backend    │
│  (Port 3000)│      │ (Port 3001) │      │ (Port 5000) │
└──────┬──────┘      └──────┬──────┘      └──────┬──────┘
       │                    │                    │
       │   HTTP Requests    │                    │
       │ ──────────────────>│                    │
       │                    │   HTTP Requests    │
       │                    │ ──────────────────>│
       │                    │                    │
       │                    │     MongoDB        │
       │                    │ ──────────────────>│
       │                    │                    │
```

---

## Data Flow

### 1. User Authentication Flow

```
User → Client App → Enters License Key
         ↓
    Backend API
         ↓
    Validates License Key
         ↓
    Checks PC Binding
         ↓
    Returns JWT Token
         ↓
    Client Stores Token
         ↓
    User Gains Access
```

**Step-by-step:**
1. User visits client website (http://localhost:3000)
2. Login modal appears automatically
3. User enters license key (format: LX-XXXX-XXXX-XXXX)
4. Client sends license key + PC ID to backend `/api/auth/login`
5. Backend validates:
   - Is the license key valid?
   - Is it tied to this PC? (unless it's an owner key)
   - Is it still active?
6. Backend returns JWT token
7. Client stores token in localStorage
8. User can now browse games

### 2. Game Browsing Flow

```
User → Client App → Browses Games
         ↓
    Fetches Games from API
         ↓
    Backend Returns Game List
         ↓
    Client Displays Games
         ↓
    User Clicks Download
         ↓
    Opens Game URL
```

**Step-by-step:**
1. User visits client website
2. Client automatically fetches games from `/api/games`
3. Games are displayed in a grid with images
4. User can:
   - Filter by category (PC, Low PC, PS2, PS3, Switch)
   - Search for specific games
   - Click download button
5. Clicking download opens the game URL in a new tab

### 3. Admin Game Management Flow

```
Admin → Admin Panel → Views Dashboard
         ↓
    Sees Statistics
         ↓
    Adds/Edits/Deletes Games
         ↓
    Sends Changes to API
         ↓
    Backend Updates Database
         ↓
    Changes Reflect on Client
```

**Step-by-step:**
1. Admin visits admin panel (http://localhost:3001)
2. Dashboard shows real-time statistics:
   - Total games
   - Games per category
3. Admin can:
   - **Add Game**: Fill form → POST to `/api/games`
   - **Edit Game**: Click edit → Update form → PUT to `/api/games/:id`
   - **Delete Game**: Click delete → Confirm → DELETE to `/api/games/:id`
4. Changes are immediately reflected on the client app

### 4. License Key Generation Flow

```
Admin → Admin Panel → Clicks Generate
         ↓
    Backend Creates Key
         ↓
    Stores in Database
         ↓
    Returns Key to Admin
         ↓
    Admin Can:
    - Copy Key
    - Send to Client
    - Clear Key
```

**Step-by-step:**
1. Admin clicks "Generate License Key"
2. Backend creates unique key (format: LX-XXXX-XXXX-XXXX)
3. Key is stored in MongoDB with:
   - Unique key string
   - PC ID (if provided)
   - Active status
   - Creation timestamp
4. Admin can:
   - Copy key to clipboard
   - Send to client (simulated)
   - Clear current key
5. Key can now be used for authentication

---

## Database Structure

### LicenseKey Collection
```javascript
{
  key: "LX-ABCD-1234-EFGH",      // Unique license key
  pcId: "PC-abc123-1234567890",   // PC identifier (optional)
  isOwner: false,                  // Owner bypass flag
  isActive: true,                  // Can be deactivated
  createdAt: 2024-01-01T00:00:00Z,
  lastUsed: 2024-01-02T00:00:00Z
}
```

### Game Collection
```javascript
{
  name: "7 DAYS TO DIE",
  category: "pc",                  // pc, lowpc, ps2, ps3, switch, ps4, hv
  size: 19.3,                      // Size in GB
  url: "https://...",              // Download URL
  img: "https://...",              // Cover image URL
  views: 0,                        // View counter
  picks: 0,                        // Download counter
  isNew: false,                    // New badge flag
  createdAt: 2024-01-01T00:00:00Z
}
```

### User Collection
```javascript
{
  username: "admin",
  password: "hashed_password",     // Bcrypt hashed
  role: "admin",                   // admin or user
  createdAt: 2024-01-01T00:00:00Z
}
```

---

## API Endpoints

### Authentication
```
POST /api/auth/login
Body: { licenseKey, pcId }
Returns: { success, token, user }

GET /api/auth/verify
Headers: Authorization: Bearer <token>
Returns: { success, data }
```

### Games
```
GET /api/games
Query: ?category=pc
Returns: { success, count, data: [games] }

GET /api/games/stats
Returns: { success, data: { total, pc, lowpc, ps2, ps3, switch, ps4, hv } }

GET /api/games/:id
Returns: { success, data: game }

POST /api/games
Body: { name, category, size, url, img, isNew }
Returns: { success, data: game }

PUT /api/games/:id
Body: { name, category, size, url, img, isNew }
Returns: { success, data: game }

DELETE /api/games/:id
Returns: { success, data: {} }
```

### License Keys
```
POST /api/licenses/generate
Body: { pcId, isOwner }
Returns: { success, data: { key, pcId, isOwner, ... } }

POST /api/licenses/validate
Body: { key, pcId }
Returns: { success, data: { key, isOwner, message } }

GET /api/licenses
Returns: { success, count, data: [licenses] }

DELETE /api/licenses/:id
Returns: { success, data: {} }

PUT /api/licenses/:id/deactivate
Returns: { success, data: license }
```

---

## Security Features

### 1. License Key Validation
- Each key is unique and stored in database
- Keys can be tied to specific PCs
- Owner bypass keys for administrators
- Keys can be deactivated

### 2. PC Binding
- Each PC gets a unique identifier stored in localStorage
- License keys are tied to PC IDs
- Prevents key sharing between different computers

### 3. Owner Bypass
- Special format: `OWNER-username-password`
- Bypasses license validation
- For administrative access

### 4. JWT Tokens
- Tokens expire after 30 days
- Stored in localStorage
- Sent with each API request

---

## Technology Stack

### Frontend (Client & Admin)
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Axios** - HTTP client for API calls
- **React Router DOM** - Navigation (can be added for multi-page)

### Backend
- **Express.js** - Web server framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variables

---

## Running the Application

### Prerequisites
- Node.js v16+
- MongoDB v4.4+
- npm or yarn

### Installation Steps

**1. Install Dependencies**
```bash
# Backend
cd backend
npm install

# Client
cd ../client
npm install

# Admin
cd ../admin
npm install
```

**2. Configure Environment**
```bash
cd backend
cp .env.example .env
# Edit .env with your settings:
# - MONGODB_URI=mongodb://localhost:27017/lincolnx
# - JWT_SECRET=your-secret-key
```

**3. Start MongoDB**
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
```

**4. Import Game Data**
```bash
cd backend
node scripts/import-games.js
```

**5. Run Applications**
```bash
# Terminal 1 - Backend (port 5000)
cd backend
npm run dev

# Terminal 2 - Client (port 3000)
cd client
npm run dev

# Terminal 3 - Admin (port 3001)
cd admin
npm run dev
```

**6. Access Applications**
- Client: http://localhost:3000
- Admin: http://localhost:3001
- API: http://localhost:5000/api

---

## Example Usage Scenarios

### Scenario 1: New User Access
1. User visits http://localhost:3000
2. Login modal appears
3. User enters license key: `LX-ABCD-1234-EFGH`
4. System validates key and binds to user's PC
5. User can now browse and download games

### Scenario 2: Admin Adds New Game
1. Admin visits http://localhost:3001
2. Fills out "Add Game" form:
   - Name: "New Game"
   - Category: "pc"
   - Size: "50"
   - URL: "https://..."
   - Image: "https://..."
3. Clicks "Add Game"
4. Game is saved to database
5. Immediately appears on client website

### Scenario 3: Generate License Key
1. Admin visits admin panel
2. Clicks "Generate License Key"
3. System creates: `LX-XYZ-123-ABC`
4. Admin copies key
5. Admin sends key to customer
6. Customer uses key to access platform

---

## Development Workflow

### Adding a New Feature

**Backend:**
1. Create controller in `backend/controllers/`
2. Create route in `backend/routes/`
3. Add route to `backend/server.js`
4. Test with Postman/Thunder Client

**Client:**
1. Create component in `client/src/components/`
2. Import and use in `client/src/App.jsx`
3. Add API calls with axios

**Admin:**
1. Add functionality to `admin/src/App.jsx`
2. Connect to backend API
3. Style with existing CSS

---

## Deployment Considerations

### Production Environment
1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET`
3. Configure MongoDB Atlas or production MongoDB
4. Update CORS origins in `server.js`
5. Build frontend apps: `npm run build`
6. Use PM2 for process management
7. Enable HTTPS
8. Add rate limiting
9. Implement admin authentication middleware

### Environment Variables
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/lincolnx
JWT_SECRET=very-secure-random-string-here
CLIENT_URL=https://your-client-domain.com
ADMIN_URL=https://your-admin-domain.com
```

---

## Troubleshooting

### MongoDB Not Connecting
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Verify network/firewall settings

### Port Already in Use
- Change ports in `vite.config.js` files
- Or stop the process using the port

### CORS Errors
- Verify `CLIENT_URL` and `ADMIN_URL` in `.env`
- Check CORS configuration in `server.js`

### Games Not Showing
- Run `node scripts/import-games.js` to import data
- Check MongoDB connection
- Verify API is running

---

## Future Enhancements

1. **User Management**
   - User registration
   - Password reset
   - User profiles

2. **Advanced Features**
   - Game ratings and reviews
   - Download history
   - Favorites system
   - Game recommendations

3. **Payment Integration**
   - Stripe/PayPal integration
   - Subscription plans
   - Invoice generation

4. **Analytics**
   - Download statistics
   - User behavior tracking
   - Popular games dashboard

5. **Security**
   - Rate limiting
   - Admin authentication
   - API key validation
   - Input sanitization

---

## Support

For questions or issues, refer to the main README.md or contact the development team.