# 🌐 Linkora - Social Media Platform

<div align="center">

![Linkora Logo](https://img.shields.io/badge/Linkora-Social_Media-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=flat&logo=mysql)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

**A modern, full-stack social media web application built with React, Node.js, Express, and MySQL**

[Features](#features) • [Tech Stack](#tech-stack) • [Installation](#installation) • [API Documentation](#api-endpoints) • [Screenshots](#screenshots)

</div>

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 About

**Linkora** is a full-featured social media platform that allows users to connect with friends, share posts and stories, and engage through likes and comments. Built with modern web technologies, it features secure authentication, real-time interactions, and a responsive user interface with dark mode support.

### Key Highlights

✅ Full-stack application with RESTful API  
✅ JWT-based secure authentication  
✅ Real-time social interactions  
✅ Responsive design with dark/light theme  
✅ Image upload functionality  
✅ 24-hour ephemeral stories  
✅ Follow/Unfollow system  
✅ Profile customization  

---

## ✨ Features

### 🔐 Authentication & Authorization
- **User Registration** - Create new accounts with encrypted passwords
- **Secure Login/Logout** - JWT token-based authentication
- **Session Management** - HTTP-only cookies for security
- **Protected Routes** - Authorization middleware

### 👤 User Profiles
- **Profile Customization** - Upload profile picture and cover photo
- **Edit Information** - Update name, email, city, website
- **View Profiles** - Browse other users' profiles
- **User Search** - Find users by name or username

### 📝 Posts & Feed
- **Create Posts** - Share text and images
- **Personalized Feed** - View posts from followed users
- **Location Tagging** - Add location to posts
- **User Tagging** - Tag friends in posts
- **Delete Posts** - Remove your own posts
- **Chronological Feed** - Posts sorted by time

### 📸 Stories
- **Upload Stories** - Share 24-hour temporary content
- **View Stories** - See friends' stories
- **Auto-Delete** - Stories automatically removed after 24 hours
- **Image Stories** - Share photo-based stories

### 💬 Social Interactions
- **Like/Unlike** - React to posts
- **Comments** - Comment on posts
- **Follow/Unfollow** - Build your network
- **View Likes** - See who liked posts
- **Comment Management** - Delete your comments

### 🔍 Discovery & Social
- **Friend Suggestions** - Discover new connections
- **Search Users** - Find people by name/username
- **Latest Activities** - View recent posts from followed users
- **Friends List** - See all your connections

### 🎨 User Experience
- **Dark Mode** - Toggle between light and dark themes
- **Persistent Preferences** - Theme saved in localStorage
- **Responsive Design** - Works on desktop and mobile
- **Material-UI Components** - Modern, clean interface
- **Real-time Updates** - Instant feedback on actions

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.0 | UI library for building user interfaces |
| **React Router DOM** | 7.13.0 | Client-side routing and navigation |
| **Vite** | Latest | Fast build tool and dev server |
| **Material-UI (MUI)** | 7.3.7 | Component library for modern UI |
| **@mui/icons-material** | 7.3.7 | Icon set |
| **Axios** | 1.13.2 | HTTP client for API requests |
| **React Query** | 5.90.20 | Data fetching and caching library |
| **Sass** | 1.97.3 | CSS preprocessor |
| **Moment.js** | 2.30.1 | Date and time formatting |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | Latest | JavaScript runtime |
| **Express** | 5.1.0 | Web application framework |
| **MySQL2** | 3.15.3 | MySQL database driver |
| **bcryptjs** | 3.0.3 | Password hashing |
| **jsonwebtoken** | 9.0.3 | JWT authentication |
| **Multer** | 2.0.2 | File upload handling |
| **CORS** | 2.8.5 | Cross-Origin Resource Sharing |
| **Cookie-Parser** | 1.4.7 | Parse HTTP cookies |
| **Moment.js** | 2.30.1 | Server-side date formatting |

### Database
| Technology | Purpose |
|------------|---------|
| **MySQL** | Relational database management system |

### Development Tools
| Tool | Purpose |
|------|---------|
| **Nodemon** | Auto-restart server on changes |
| **ESLint** | Code linting and quality |
| **Git** | Version control |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  CLIENT (Browser)                        │
│              React SPA (Port 5173)                       │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Components: NavBar, Posts, Stories, Comments     │  │
│  │  Context: Auth, DarkMode                          │  │
│  │  Routing: React Router                            │  │
│  │  HTTP Client: Axios                               │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                         │
                         │ HTTP/REST API
                         ▼
┌─────────────────────────────────────────────────────────┐
│               EXPRESS SERVER (Port 8800)                 │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Middleware: CORS, JWT Auth, Cookie Parser        │  │
│  ├───────────────────────────────────────────────────┤  │
│  │  Routes: /auth, /users, /posts, /comments,       │  │
│  │          /likes, /stories, /relationships         │  │
│  ├───────────────────────────────────────────────────┤  │
│  │  Controllers: Business Logic, Data Validation     │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                         │
                         │ SQL Queries
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   MySQL DATABASE                         │
│     Database: social                                     │
│     Tables: users, posts, comments, likes,               │
│             stories, relationships                       │
└─────────────────────────────────────────────────────────┘
```

**Architecture Pattern:** MVC (Model-View-Controller)  
**API Style:** RESTful  
**Authentication:** JWT with HTTP-only Cookies

---

## 📁 Project Structure

```
Linkora/
├── backend/                    # Backend server
│   ├── controllers/            # Business logic
│   │   ├── auth.js             # Authentication logic
│   │   ├── user.js             # User operations
│   │   ├── post.js             # Post management
│   │   ├── comment.js          # Comment handling
│   │   ├── like.js             # Like functionality
│   │   ├── story.js            # Story operations
│   │   └── relationship.js     # Follow/Unfollow logic
│   ├── routes/                 # API routes
│   │   ├── auth.js             # Auth endpoints
│   │   ├── users.js            # User endpoints
│   │   ├── posts.js            # Post endpoints
│   │   ├── comments.js         # Comment endpoints
│   │   ├── likes.js            # Like endpoints
│   │   ├── stories.js          # Story endpoints
│   │   └── relationships.js    # Relationship endpoints
│   ├── connect.js              # Database configuration
│   ├── index.js                # Server entry point
│   └── package.json            # Backend dependencies
│
├── frontend/                   # Frontend application
│   ├── public/                 # Static files
│   │   └── upload/             # Uploaded images
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── navbar/         # Navigation bar
│   │   │   ├── leftbar/        # Left sidebar
│   │   │   ├── rightbar/       # Right sidebar
│   │   │   ├── posts/          # Posts list
│   │   │   ├── post/           # Single post
│   │   │   ├── share/          # Post creation
│   │   │   ├── stories/        # Stories component
│   │   │   ├── comments/       # Comments section
│   │   │   └── update/         # Profile update modal
│   │   ├── pages/              # Page components
│   │   │   ├── login/          # Login page
│   │   │   ├── register/       # Registration page
│   │   │   ├── home/           # Home feed
│   │   │   └── profile/        # User profile
│   │   ├── context/            # Context providers
│   │   │   ├── authContext.jsx # Auth state management
│   │   │   └── darkmodeContext.jsx # Theme management
│   │   ├── App.jsx             # Main app component
│   │   ├── main.jsx            # Entry point
│   │   └── axios.jsx           # Axios configuration
│   └── package.json            # Frontend dependencies
│
├── package.json                # Root package file
└── README.md                   # This file
```

---

## 🚀 Installation

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MySQL** (v5.7 or higher)
- **Git**

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/linkora.git
cd linkora
```

### Step 2: Install Dependencies

#### Install Root Dependencies
```bash
npm install
```

#### Install Backend Dependencies
```bash
cd backend
npm install
cd ..
```

#### Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

### Step 3: Database Setup

1. **Create MySQL Database**
```sql
CREATE DATABASE social;
USE social;
```

2. **Create Tables**

**Users Table:**
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  profilePic VARCHAR(255),
  coverPic VARCHAR(255),
  city VARCHAR(255),
  website VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Posts Table:**
```sql
CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  `desc` TEXT,
  img VARCHAR(255),
  userId INT NOT NULL,
  location VARCHAR(255),
  taggedUsers TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

**Comments Table:**
```sql
CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  `desc` TEXT NOT NULL,
  userId INT NOT NULL,
  postId INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE
);
```

**Likes Table:**
```sql
CREATE TABLE likes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  postId INT NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE
);
```

**Stories Table:**
```sql
CREATE TABLE stories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  img VARCHAR(255) NOT NULL,
  userId INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

**Relationships Table:**
```sql
CREATE TABLE relationships (
  id INT AUTO_INCREMENT PRIMARY KEY,
  followerUserId INT NOT NULL,
  followedUserId INT NOT NULL,
  FOREIGN KEY (followerUserId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (followedUserId) REFERENCES users(id) ON DELETE CASCADE
);
```

### Step 4: Configure Environment

Update database credentials in `backend/connect.js`:

```javascript
export const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "your_password",  // Update with your MySQL password
    database: "social"
});
```

### Step 5: Run the Application

#### Start Backend Server
```bash
cd backend
npm start
# Server runs on http://localhost:8800
```

#### Start Frontend (in a new terminal)
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

### Step 6: Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

---

## ⚙️ Configuration

### Backend Configuration

**Server Port:** 8800  
**JWT Secret:** `secretkey` (Change in production!)  
**CORS Origin:** `http://localhost:5173`  
**Upload Directory:** `../frontend/public/upload`

### Frontend Configuration

**API Base URL:** `http://localhost:8800/backend`  
**Dev Server Port:** 5173  

To change these settings, update:
- Backend: `backend/index.js`
- Frontend: `frontend/src/axios.jsx`

---

## 🗄️ Database Setup

### Database Name
`social`

### Tables Overview

| Table | Description | Key Fields |
|-------|-------------|------------|
| **users** | User accounts and profiles | id, username, email, password, name, profilePic, coverPic |
| **posts** | User posts | id, desc, img, userId, createdAt |
| **comments** | Post comments | id, desc, userId, postId, createdAt |
| **likes** | Post likes | id, userId, postId |
| **stories** | 24-hour stories | id, img, userId, createdAt |
| **relationships** | Follow/Following | id, followerUserId, followedUserId |

### Relationships
- `users` → `posts` (One-to-Many)
- `users` → `comments` (One-to-Many)
- `users` → `stories` (One-to-Many)
- `users` ↔ `users` via `relationships` (Many-to-Many)
- `posts` ↔ `users` via `likes` (Many-to-Many)

---

## 🔌 API Endpoints

### Authentication (`/backend/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | Login user | No |
| POST | `/logout` | Logout user | Yes |

### Users (`/backend/users`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/:userId` | Get user by ID | Yes |
| PUT | `/` | Update user profile | Yes |
| GET | `/search?q=query` | Search users | Yes |
| GET | `/suggestions` | Get friend suggestions | Yes |
| GET | `/activities` | Get latest activities | Yes |
| GET | `/friends` | Get friends list | Yes |

### Posts (`/backend/posts`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/?userId=:id` | Get posts (feed or user posts) | Yes |
| POST | `/` | Create new post | Yes |
| DELETE | `/:id` | Delete post | Yes |

### Comments (`/backend/comments`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/?postId=:id` | Get comments for post | Yes |
| POST | `/` | Add comment | Yes |
| DELETE | `/:id` | Delete comment | Yes |

### Likes (`/backend/likes`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/?postId=:id` | Get likes for post | Yes |
| POST | `/` | Like a post | Yes |
| DELETE | `/?postId=:id` | Unlike a post | Yes |

### Stories (`/backend/stories`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all stories (last 24h) | Yes |
| POST | `/` | Create new story | Yes |
| DELETE | `/:id` | Delete story | Yes |

### Relationships (`/backend/relationships`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/?followedUserId=:id` | Check follow status | Yes |
| POST | `/` | Follow user | Yes |
| DELETE | `/?userId=:id` | Unfollow user | Yes |

### File Upload (`/backend/upload`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/upload` | Upload image file | No |

---

## 🔒 Security Features

### Password Security
- **bcrypt hashing** with 10 salt rounds
- Never store plain text passwords
- Secure password comparison

### Authentication
- **JWT tokens** for stateless authentication
- **HTTP-only cookies** to prevent XSS attacks
- Token verification middleware on protected routes
- Secure session management

### Authorization
- User ownership validation (users can only modify their own content)
- Protected API routes
- Role-based access control

### API Security
- **CORS** configuration to restrict origins
- **Parameterized SQL queries** to prevent injection
- Input validation
- Error handling without exposing sensitive data

### File Upload Security
- File type validation
- Filename sanitization
- Controlled upload directory

---

## 📸 Screenshots

### Home Feed
*[Add screenshot of home page with posts and stories]*

### User Profile
*[Add screenshot of user profile page]*

### Dark Mode
*[Add screenshot showcasing dark theme]*

### Post Creation
*[Add screenshot of share component]*

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

---

## 🐛 Known Issues

- Stories older than 24 hours need manual cleanup (no automatic cron job)
- File upload size not restricted
- No email verification on registration

---

## 🔮 Future Enhancements

- [ ] Real-time notifications with WebSockets
- [ ] Direct messaging system
- [ ] Video post support
- [ ] Email verification
- [ ] Two-factor authentication
- [ ] Mobile application (React Native)
- [ ] Advanced search filters
- [ ] Group creation
- [ ] Live streaming
- [ ] Cloud storage integration (AWS S3)

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- React Team for the amazing library
- Express.js community
- Material-UI for beautiful components
- All open-source contributors

---

## 📞 Support

If you have any questions or need help, please open an issue or contact me directly.

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ by Fahad Hasan Siam

</div>
