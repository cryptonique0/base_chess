# Getting Started with PassportX

Welcome to PassportX! This guide will help you get the project up and running in under 10 minutes.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Setup](#project-setup)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js** 18.x or higher - [Download](https://nodejs.org/)
- **npm** 9.x or higher (comes with Node.js)
- **MongoDB** 6.0 or higher - [Download](https://www.mongodb.com/try/download/community)
- **Redis** 7.x or higher - [Download](https://redis.io/download)
- **Git** - [Download](https://git-scm.com/downloads)

### Optional Software
- **Docker** - For containerized development
- **Clarinet** - For smart contract development

### Stacks Wallet
- **Hiro Wallet** or **Leather Wallet** - [Get Hiro](https://wallet.hiro.so/) | [Get Leather](https://leather.io/)

---

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/DeborahOlaboye/PassportX.git
cd PassportX
```

### 2. Install Dependencies

#### Option A: Using Setup Script (Recommended)

**Windows (PowerShell):**
```powershell
.\setup-enhancements.ps1
```

**Linux/Mac:**
```bash
chmod +x setup-enhancements.sh
./setup-enhancements.sh
```

#### Option B: Manual Installation

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Configure Environment Variables

#### Frontend Environment

Create `.env.local` in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
# Stacks Network
NEXT_PUBLIC_NETWORK=testnet
NEXT_PUBLIC_STACKS_API_URL=https://api.testnet.hiro.so

# Contract Addresses (Testnet)
NEXT_PUBLIC_CONTRACT_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

#### Backend Environment

Create `.env` in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/passportx

# Redis
REDIS_URL=redis://localhost:6379

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Stacks Network
STACKS_NETWORK=testnet
STACKS_API_URL=https://api.testnet.hiro.so

# Contract Addresses
CONTRACT_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM

# Optional: Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 4. Start Services

#### Start MongoDB

**Windows:**
```powershell
# If installed as service, it should already be running
# Check status in Services app

# Or start manually:
mongod
```

**Linux/Mac:**
```bash
# Start MongoDB service
sudo systemctl start mongod

# Or use Homebrew (Mac):
brew services start mongodb-community
```

#### Start Redis

**Windows:**
```powershell
# If installed as service:
redis-server
```

**Linux/Mac:**
```bash
# Start Redis service
sudo systemctl start redis

# Or use Homebrew (Mac):
brew services start redis
```

### 5. Initialize Database

Run the database migration to add the role field to existing users:

```bash
# Connect to MongoDB
mongosh passportx

# Run migration
db.users.updateMany(
  { role: { $exists: false } },
  { $set: { role: 'user' } }
)

# Exit
exit
```

### 6. Start Development Servers

#### Terminal 1: Start Backend API

```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:3001`

#### Terminal 2: Start Frontend

```bash
# From root directory
npm run dev
```

The frontend will start on `http://localhost:3000`

### 7. Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **API Health Check**: http://localhost:3001/api/health

---

## Project Setup

### Understanding the Structure

```
PassportX/
├── backend/              # Backend API (Express + MongoDB)
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   ├── middleware/   # Custom middleware
│   │   └── server.ts     # Entry point
│   └── package.json
│
├── contracts/            # Smart contracts (Clarity)
│   ├── passport-nft.clar
│   ├── badge-metadata.clar
│   └── ...
│
├── src/                  # Frontend (Next.js + React)
│   ├── app/             # App router pages
│   ├── components/      # React components
│   ├── lib/             # Utilities
│   └── stores/          # State management
│
├── docs/                # Documentation
├── tests/               # Test files
└── package.json         # Root package.json
```

### Database Setup

#### Create Database Indexes

```javascript
// Connect to MongoDB
mongosh passportx

// Create indexes for better performance
db.users.createIndex({ stacksAddress: 1 }, { unique: true })
db.users.createIndex({ customUrl: 1 }, { unique: true, sparse: true })
db.communities.createIndex({ slug: 1 }, { unique: true })
db.communities.createIndex({ admins: 1 })
db.badges.createIndex({ recipient: 1 })
db.badges.createIndex({ badgeId: 1 }, { unique: true })
```

---

## Development

### Running the Application

#### Development Mode (Hot Reload)

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
npm run dev
```

#### Production Mode

```bash
# Build both frontend and backend
npm run build
cd backend && npm run build && cd ..

# Start production servers
npm start  # Frontend
cd backend && npm start  # Backend
```

### Code Quality

#### Linting

```bash
# Lint frontend
npm run lint

# Fix lint issues
npm run lint:fix

# Lint backend
cd backend
npm run lint
```

#### Formatting

```bash
# Format all files
npm run format
```

### Testing

#### Unit Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

#### E2E Tests

```bash
# Run Cypress tests
npm run test:e2e

# Open Cypress UI
npm run test:e2e:open
```

---

## Building for Production

### Environment Setup

1. Update environment variables for production
2. Set `NODE_ENV=production`
3. Use production database URLs
4. Configure proper JWT secrets

### Build Process

```bash
# 1. Install dependencies
npm install --production
cd backend && npm install --production

# 2. Build frontend
npm run build

# 3. Build backend
cd backend
npm run build

# 4. Deploy smart contracts (if needed)
cd ../contracts
clarinet deployments generate --mainnet
./deploy-mainnet.sh
```

### Deployment Options

#### Option 1: Traditional Hosting

- **Frontend**: Vercel, Netlify, or AWS S3 + CloudFront
- **Backend**: DigitalOcean, AWS EC2, or Heroku
- **Database**: MongoDB Atlas
- **Cache**: Redis Cloud

#### Option 2: Docker

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f
```

#### Option 3: Kubernetes

See `k8s/` directory for Kubernetes manifests (if available)

---

## Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Find and kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:3000 | xargs kill -9
```

#### MongoDB Connection Error

```bash
# Check if MongoDB is running
# Windows:
services.msc  # Look for MongoDB

# Linux/Mac:
sudo systemctl status mongod

# Test connection
mongosh
```

#### Redis Connection Error

```bash
# Check if Redis is running
redis-cli ping
# Should return: PONG

# Start Redis if not running
# Windows:
redis-server

# Linux/Mac:
sudo systemctl start redis
```

#### Build Errors

```bash
# Clear caches
rm -rf node_modules package-lock.json
rm -rf backend/node_modules backend/package-lock.json
rm -rf .next backend/dist

# Reinstall
npm install
cd backend && npm install
```

#### TypeScript Errors

```bash
# Ensure TypeScript is installed
npm install -g typescript

# Check tsconfig.json is valid
tsc --noEmit
```

### Getting Help

- **Documentation**: Check the [docs/](../docs/) directory
- **Issues**: [GitHub Issues](https://github.com/DeborahOlaboye/PassportX/issues)
- **Discussions**: [GitHub Discussions](https://github.com/DeborahOlaboye/PassportX/discussions)
- **Discord**: Community Discord (link coming soon)

---

## Next Steps

Once you have the application running:

1. **Create an Account** - Connect your Stacks wallet
2. **Join a Community** - Browse and join existing communities
3. **Earn Badges** - Participate and earn achievement badges
4. **Create a Community** - Start your own community (requires admin permissions)
5. **Explore the API** - Check out [API_REFERENCE.md](./docs/API_REFERENCE.md)
6. **Read the Docs** - Deep dive into [ARCHITECTURE.md](./docs/ARCHITECTURE.md)

---

## Additional Resources

- **[CHANGELOG.md](../CHANGELOG.md)** - Version history and changes
- **[CONTRIBUTING.md](../CONTRIBUTING.md)** - How to contribute
- **[DEPLOYMENT.md](../MAINNET_DEPLOYMENT_INSTRUCTIONS.md)** - Production deployment guide
- **[API Reference](./docs/API_REFERENCE.md)** - Complete API documentation
- **[Smart Contracts](../contracts/SMART_CONTRACTS.md)** - Contract documentation

---

**Happy Building! 🚀**

*Last updated: December 27, 2025*
