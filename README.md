
# CareConnect

CareConnect is a full-stack Social Development Events Platform where users can discover, organize, and participate in community events.

The platform helps people connect through activities such as tree plantation, donation drives, cleanup campaigns, educational programs, and other social initiatives.

## Live Website

[CareConnect Live Website](https://careconnect-client-a79p.vercel.app/)

## GitHub Repositories

- Client: https://github.com/masrur-dev/careconnect-client
- Server: https://github.com/masrur-dev/careconnect-server

## Features

- Responsive homepage and navigation
- User registration and login
- Better Auth session management
- User profile information
- Browse upcoming community events
- View detailed event information
- Create new events
- Join community events
- Prevent duplicate event participation
- View joined events
- Manage personal events
- Update event information
- Delete events with confirmation
- Protected pages and APIs
- Dark and light theme toggle
- Toast notifications
- Loading and error handling
- Custom 404 page

## Technologies Used

### Frontend
- Next.js (App Router)
- React
- Tailwind CSS v4
- DaisyUI v5
- Better Auth
- Sonner
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- MongoDB Node.js Driver
- CORS
- dotenv

## Authentication

CareConnect uses Better Auth for user authentication.

Supported functionality:
- Email and password registration
- Email and password login
- User session management
- Logout
- Protected pages

The Express backend validates user sessions before allowing protected operations.

## Event Management

Authenticated users can:
1. Create community events.
2. Update their own events.
3. Delete their own events.
4. Join available events.
5. View events they have joined.

Event information is stored in MongoDB Atlas.

## Installation and Setup

### 1. Clone the Client Repository

```bash
git clone https://github.com/masrur-dev/careconnect-client.git
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the client project root.

```env
MONGODB_URI=your_mongodb_connection_string
BETTER_AUTH_SECRET=your_secure_random_secret
BETTER_AUTH_URL=http://localhost:3000
```

Never commit real environment variables or credentials.

### 4. Run the Client

```bash
npm run dev
```

Open http://localhost:3000.

### 5. Configure the Backend

Clone the separate server repository:

https://github.com/masrur-dev/careconnect-server

Install its dependencies and create a `.env` file:

```env
PORT=5000
CLIENT_URL=http://localhost:3000
MONGODB_URI=your_mongodb_connection_string
```

Run the server:

```bash
npm run dev
```

The backend runs at http://localhost:5000.

## API Endpoints

### Public Endpoints
- GET /events
- GET /events/recent
- GET /events/:id

### Protected Endpoints
- POST /events
- POST /events/:id/join
- GET /events/:id/join-status
- GET /my-joined-events
- GET /my-events
- PATCH /events/:id
- DELETE /events/:id

Protected endpoints require an authenticated user session.

## Project Structure

```text
src/
├── app/
│   ├── api/auth/
│   ├── events/
│   ├── create-event/
│   ├── joined-events/
│   ├── manage-events/
│   ├── update-event/
│   ├── login/
│   └── register/
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── EventCard.jsx
│   ├── AuthNav.jsx
│   ├── JoinEventButton.jsx
│   └── ThemeToggle.jsx
└── lib/
    ├── auth.js
    ├── auth-client.js
    └── mongodb.js
```

## Deployment

Production deployment is pending.

Before deployment, configure production environment variables, allowed origins, authentication settings, and backend API URLs.

## Author

Developed by masrur-dev.

## License

Created as an educational project for Programming Hero Batch 14, Assignment 8.
