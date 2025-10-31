# 🎨 ChitraArtist - Art Portfolio Platform

A modern, full-stack web platform where artists can create, manage, and showcase their artwork portfolios. Features AI-powered artwork evaluation and weekly competitive leaderboards to create an engaging community for artists.

## ✨ Features

### 🚀 Core Functionality
- **Personal Portfolio Pages** - Each artist gets their own unique URL (e.g., `https://chitra-artist.vercel.app/artist/satvik`)
- **Artwork Management** - Upload, edit, delete, and organize artwork with categories
- **Public Portfolios** - Beautiful, shareable portfolio pages for visitors
- **Profile Customization** - Bio, profile images, and social media links

### 🤖 AI-Powered Competition System
- **Automatic Scoring** - AI evaluates artwork on multiple dimensions:
  - Aesthetic Quality
  - Technical Skill
  - Creativity & Originality
  - Composition & Balance
- **Weekly Leaderboards** - Compete with other artists every week
- **Rankings & Analytics** - Track your position, percentile, and performance
- **Top Artworks Showcase** - Best artworks featured automatically

### 🔐 User Features
- **Secure Authentication** - JWT-based auth with protected routes
- **Role-Based Access** - Artists can only manage their own artwork
- **Upload Limits** - Configurable per-artist artwork limits
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client for API requests
- **Lucide React** - Beautiful icon library
- **React Dropzone** - File upload with drag & drop

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - Authentication tokens
- **Cloudinary** - Image hosting and optimization
- **Multer** - File upload handling
- **Bcrypt** - Password hashing

### Infrastructure
- **MongoDB Atlas** - Cloud database
- **Cloudinary** - Image storage and CDN
- **Render** - Backend hosting
- **Vercel** - Frontend hosting

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (free tier available)
- Cloudinary account (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ChitraArtist.git
   cd ChitraArtist
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables**

   **Backend** (`backend/.env`):
   ```env
   PORT=5001
   NODE_ENV=development
   MONGO_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-super-secret-jwt-key-32-characters-minimum
   CLOUD_NAME=your-cloudinary-cloud-name
   API_KEY=your-cloudinary-api-key
   API_SECRET=your-cloudinary-api-secret
   FRONTEND_URL=http://localhost:5173
   AI_SCORING_PROVIDER=simulated
   MAX_ARTWORKS_PER_ARTIST=100
   ```

   **Frontend** (`frontend/.env`):
   ```env
   VITE_API_URL=http://localhost:5001/api
   ```

5. **Run the development servers**

   **Backend** (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```

   **Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

6. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5001

## 📦 Deployment

### Backend (Render)
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set root directory to `backend`
4. Add all environment variables
5. Deploy!

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set root directory to `frontend`
3. Add `VITE_API_URL` environment variable
4. Deploy!

**Detailed deployment guide:** See `DEPLOY_STEPS.md`

## 🎯 Project Structure

```
ChitraArtist/
├── backend/
│   ├── config/          # Database configuration
│   ├── middleware/      # Auth middleware
│   ├── models/          # MongoDB models (Artist, Art, Competition)
│   ├── routes/          # API routes
│   ├── services/        # AI scoring service
│   └── server.js        # Express server
│
├── frontend/
│   ├── src/
│   │   ├── Components/  # Reusable components
│   │   ├── Pages/       # Page components
│   │   ├── context/     # React context (Auth)
│   │   └── utils/      # API utilities
│   └── index.html
│
└── README.md
```

## 🔑 Key Features Explained

### AI Scoring System
The platform automatically evaluates uploaded artwork using multiple criteria:
- **Aesthetic Score**: Visual appeal and color harmony
- **Technical Score**: Skill level and detail execution
- **Creativity Score**: Originality and innovation
- **Composition Score**: Layout and visual balance

Scoring can be done via:
- **Hugging Face Inference API** (free tier: 30k requests/month)
- **Simulated scoring** (default, works offline)
- **Custom ML models** (easily extensible)

### Competition System
- New artwork automatically enters the current week's competition
- Leaderboards reset every Monday
- Rankings based on total score from all artworks
- Real-time updates as artists upload

### Upload Limits
- Configurable per-artist artwork limits
- Helps manage storage costs on free tiers
- Default: 100 artworks per artist

## 🎨 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new artist
- `POST /api/auth/login` - Login artist
- `GET /api/auth/me` - Get current artist
- `PUT /api/auth/profile` - Update profile

### Artworks
- `GET /api/art/my-artworks` - Get artist's artworks
- `POST /api/art` - Create artwork (auto-scored)
- `DELETE /api/art/:id` - Delete artwork

### Competition
- `GET /api/competition/current` - Get current week's competition
- `GET /api/competition/leaderboard` - Get full leaderboard
- `GET /api/competition/my-rank` - Get artist's rank

### Upload
- `POST /api/upload` - Upload image to Cloudinary

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Environment variable protection
- Secure file upload validation
- Ownership verification for artwork operations

## 🌐 Live Demo

- **Frontend**: [https://chitra-artist.vercel.app](https://chitra-artist.vercel.app)
- **Backend API**: [https://chitraartist.onrender.com](https://chitraartist.onrender.com)

## 📝 Environment Variables

See `.env.example` files for complete list of required environment variables.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Satvik Pandey**

- GitHub: [@satvik078](https://github.com/satvik078)
- Portfolio: [Live Site](https://chitra-artist.vercel.app)

## 🙏 Acknowledgments

- MongoDB Atlas for free database hosting
- Cloudinary for free image hosting
- Render for free backend hosting
- Vercel for free frontend hosting
- Hugging Face for AI model APIs
- Cursor, Warp for making work Easier
- All the open-source libraries that made this possible

## 📊 Project Status

✅ **Fully Functional**
- User authentication & profiles
- Artwork upload & management
- Public portfolio pages
- AI scoring system
- Weekly competition leaderboards
- Production deployment ready

## 🚧 Future Enhancements

- [ ] Enhanced AI scoring with custom models
- [ ] Social features (follow, like, comment)
- [ ] Email notifications
- [ ] Payment integration for prints
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)

---

⭐ **Star this repo if you find it helpful!**

Made with ❤️ for the art community
