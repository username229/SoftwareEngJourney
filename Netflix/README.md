# 🎬 Netflix Clone

<div align="center">

![Netflix Clone](https://img.shields.io/badge/Netflix_Clone-v2.0.0-red?style=for-the-badge&logo=netflix)
![Next.js](https://img.shields.io/badge/Next.js-15.5.5-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?style=for-the-badge&logo=docker)
![SCSS](https://img.shields.io/badge/SCSS-Styled-pink?style=for-the-badge&logo=sass)

**Professional Netflix clone with TMDB API, authentication, and favorites system!**

[🐳 Docker Hub](https://hub.docker.com) • [📖 Documentation](README.md) • [🚀 Live Demo](http://localhost:3000)

</div>

---

## 🚀 Quick Start with Docker

```bash
# Clone the repository
git clone https://github.com/username229/SoftwareEngJourney.git
cd SoftwareEngJourney

# Run with Docker Compose
docker-compose up --build

# Access: http://localhost:3000
```

---

## ✨ Premium Features

### 🎯 **Core Features**
- 🔥 **Netflix Original Interface** - Authentic Netflix design
- 🔍 **Smart Search** - Real-time search with TMDB API
- 🎬 **Complete Catalog** - Updated movies and TV shows
- ❤️ **Favorites List** - Personalized user system
- 🌟 **Ratings & Reviews** - Classification system

### � **Authentication & Security**
- 👤 **Login/Register** - Complete authentication system
- 🔒 **Secure Sessions** - Persistent state management
- 🛡️ **Robust Validation** - Protection against common attacks

### 🎨 **Modern UI/UX**
- 📱 **Fully Responsive** - Works on all devices
- 🌙 **Netflix Theme** - Professional dark interface
- ⚡ **Fluid Animations** - Smooth transitions and micro-interactions
- 🚀 **Optimized Performance** - Fast loading with skeleton screens



---

## �️ Tech Stack

### **Frontend**
- **Next.js 15.5.5** - React Framework with App Router
- **TypeScript** - Static typing and IntelliSense
- **SCSS/CSS Modules** - Modular and scalable styling
- **React Hooks** - Modern state management

### **APIs & Services**
- **TMDB API** - Official movie/TV database
- **Axios** - Optimized HTTP client
- **REST API** - RESTful architecture

### **DevOps & Deploy**
- **Docker** - Complete containerization
- **Docker Compose** - Service orchestration
- **Multi-stage Build** - Image optimization
- **Nginx** - Reverse proxy and static server

---

## � Docker Setup

### **Prerequisites**
- Docker Desktop 4.0+
- Docker Compose 2.0+
- 4GB RAM available

### **Docker Architecture**
```
SoftwareEngJourney/
├── 🐳 docker-compose.yml      # Main orchestration
├── 📁 Netflix/
│   ├── 🐳 Dockerfile         # Next.js container
│   ├── 📦 package.json       # Node.js dependencies
│   └── ⚙️ next.config.ts     # Next.js configuration
└── 📁 chat/
    ├── 🐳 Dockerfile         # Nginx container
    └── 🗂️ static files       # HTML/CSS/JS
```

### **Docker Commands**

```bash
# 🚀 Development (with hot-reload)
docker-compose -f docker-compose.dev.yml up --build

# 🏭 Production (optimized)
docker-compose up --build

# 🔧 Netflix service only
docker-compose up netflix

# 🧹 Complete cleanup
docker-compose down --volumes --rmi all
```

### **Environment Variables**
Create `.env.local` in Netflix folder:
```env
# TMDB API Configuration
NEXT_PUBLIC_TMDB_API_KEY=your_api_key_here
NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p

# App Configuration
NEXT_PUBLIC_APP_NAME=Netflix Clone
NEXT_PUBLIC_APP_VERSION=2.0.0
NODE_ENV=production

# Docker Configuration
PORT=3000
HOSTNAME=0.0.0.0
```

---

## � Project Structure

```
Netflix/
├── 📁 public/                 # Static assets
│   ├── 📄 manifest.json       # PWA manifest
│   ├── 🖼️ favicon.ico         # Favicon
│   └── 📁 netflix-img/        # Netflix images
├── 📁 src/
│   ├── 📁 app/                # Next.js App Router
│   │   ├── � layout.tsx      # Main layout
│   │   ├── 📄 page.tsx        # Home page
│   │   └── 🎨 globals.css     # Global styles
│   ├── �📁 componentes/        # React components
│   │   ├── 🔐 Auth/           # Authentication system
│   │   ├── 🎬 NetflixApp/     # Main app
│   │   ├── 🃏 NetflixCard/    # Content cards
│   │   ├── 🔍 SearchBar/      # Search bar
│   │   ├── ⭐ StarRating/     # Rating system
│   │   └── 📺 YouTubePlayer/  # Trailer player
│   ├── 📁 services/           # Services and APIs
│   │   ├── 🎬 netflixService.ts # TMDB integration
│   │   └── 🤖 recommendationService.ts
│   ├── 📁 types/              # TypeScript types
│   │   ├── 🎭 content.ts      # Content types
│   │   └── 👤 user.ts         # User types
│   └── 📁 utils/              # Utilities
│       ├── ♿ accessibility.ts # Accessibility
│       └── ⚡ performance.ts   # Optimizations
├── � Dockerfile             # Docker configuration
├── 📦 package.json           # Dependencies
├── ⚙️ next.config.ts         # Next.js config
└── � README.md              # This file
```

---

## 🧪 Available Scripts

```bash
# 🔧 Development
npm run dev              # Development server
npm run dev:docker       # Development in Docker

# 🏭 Production
npm run build            # Optimized build
npm run start            # Production server
npm run docker:build     # Build Docker image

# 🔍 Code Quality
npm run lint             # ESLint + auto fix
npm run type-check       # TypeScript check
npm run format           # Prettier formatter

# 🧪 Tests (future)
npm run test             # Jest unit tests
npm run test:e2e         # Cypress e2e tests
```

---



---

## 🎯 Usage Guide

### **1. 🏠 Home Page**
- Browse featured content
- Use category carousel
- Explore personalized recommendations

### **2. 🔍 Search System**
- Type content name
- Use advanced filters (genre, year, rating)
- Navigate paginated results

### **3. 👤 User Account**
- Create your free account
- Login with secure credentials
- Manage personalized profile

### **4. ❤️ Favorites List**
- Add content to your list
- Remove unwanted items
- Sync across devices

### **5. 🎬 Content Details**
- View complete synopses
- Check cast and crew
- Watch YouTube trailers
- Read community reviews

---

## 🤝 Contributing

Contributions are very welcome! 

### **🔄 Workflow**
1. 🍴 Fork the project
2. 🌿 Create a branch (`git checkout -b feature/amazing-feature`)
3. 💾 Commit your changes (`git commit -m 'Add amazing feature'`)
4. 📤 Push to the branch (`git push origin feature/amazing-feature`)
5. 🔃 Open a Pull Request

### **📋 Guidelines**
- Use TypeScript for type safety
- Follow ESLint/Prettier standards
- Write descriptive commits
- Document new features
- Test locally with Docker

---

## 📝 License

This project is under the **MIT** license. See the [LICENSE](../LICENSE) file for more details.

```
MIT License - You can use, modify and distribute freely!
```

---

## 🙏 Acknowledgments & Credits

- 🎬 **[TMDB](https://www.themoviedb.org/)** - Free and complete API
- ⚛️ **[Next.js Team](https://nextjs.org/)** - Amazing framework
- 🐳 **[Docker](https://docker.com/)** - Simplified containerization
- 🎨 **[Netflix](https://netflix.com/)** - Design inspiration
- 💻 **[Vercel](https://vercel.com/)** - Deploy platform

---

## 📞 Support & Contact

<div align="center">

**Developed with ❤️ by [Username229](https://github.com/username229)**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/username229)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/username229)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:contact@username229.dev)

⭐ **If this project helped you, consider giving it a star!** ⭐

[![Stars](https://img.shields.io/github/stars/username229/SoftwareEngJourney?style=social)](https://github.com/username229/SoftwareEngJourney/stargazers)
[![Forks](https://img.shields.io/github/forks/username229/SoftwareEngJourney?style=social)](https://github.com/username229/SoftwareEngJourney/network/members)
[![Issues](https://img.shields.io/github/issues/username229/SoftwareEngJourney)](https://github.com/username229/SoftwareEngJourney/issues)

</div>

---

<div align="center">
<sub>🚀 Ready to deploy • 🐳 Docker optimized • ⚡ Performance focused</sub>
</div>
