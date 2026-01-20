# PassportX Architecture Documentation

## System Overview

PassportX is a decentralized achievement passport platform built on the Stacks blockchain, enabling communities to issue verifiable, portable achievement badges as soulbound NFTs.

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend Layer                           │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐   │
│  │  Next.js App │  │ WalletConnect│  │ Real-time Updates  │   │
│  │   (React)    │  │  Integration │  │   (Socket.io)      │   │
│  └──────────────┘  └──────────────┘  └────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                        Backend API Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐   │
│  │   Express    │  │   Auth       │  │   Notification     │   │
│  │   REST API   │  │  Middleware  │  │     Service        │   │
│  └──────────────┘  └──────────────┘  └────────────────────┘   │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐   │
│  │   Badge      │  │  Community   │  │    Analytics       │   │
│  │   Service    │  │   Service    │  │     Service        │   │
│  └──────────────┘  └──────────────┘  └────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                      Data Persistence Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐   │
│  │   MongoDB    │  │   Redis      │  │      IPFS          │   │
│  │  (Database)  │  │   (Cache)    │  │  (Metadata)        │   │
│  └──────────────┘  └──────────────┘  └────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                     Blockchain Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐   │
│  │   Stacks     │  │  Chainhooks  │  │   Smart            │   │
│  │  Blockchain  │  │  (Events)    │  │  Contracts         │   │
│  └──────────────┘  └──────────────┘  └────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  passport-nft | badge-metadata | badge-issuer | ...     │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Core Components

### 1. Frontend (Next.js)

**Tech Stack:**
- Next.js 14 (React Framework)
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- Socket.io Client (Real-time)
- @stacks/connect (Wallet Integration)

**Key Features:**
- Server-Side Rendering (SSR) for SEO
- Static Site Generation (SSG) for performance
- Dynamic imports for code splitting
- Responsive design with mobile-first approach

**Directory Structure:**
```
src/
├── app/               # Next.js app router pages
├── components/        # Reusable React components
├── lib/              # Utility functions and helpers
├── hooks/            # Custom React hooks
├── stores/           # Zustand state stores
└── styles/           # Global styles and Tailwind config
```

---

### 2. Backend API (Express.js)

**Tech Stack:**
- Node.js with TypeScript
- Express.js (REST API)
- MongoDB with Mongoose (Database)
- Socket.io (WebSockets)
- JWT (Authentication)
- Helmet (Security)

**Key Services:**

#### Authentication Service
```typescript
// Handles user authentication and session management
- Stacks wallet signature verification
- JWT token generation and validation
- Session management
- Role-based access control (RBAC)
```

#### Badge Service
```typescript
// Manages badge operations
- Badge issuance workflow
- Metadata management
- Verification logic
- Revocation handling
```

#### Community Service
```typescript
// Handles community operations
- Community creation
- Member management
- Admin permissions
- Settings configuration
```

#### Notification Service
```typescript
// Real-time notification system
- Badge received notifications
- Community updates
- System announcements
- Email integration (optional)
```

#### Analytics Service
```typescript
// Provides insights and metrics
- User activity tracking
- Badge distribution analytics
- Community growth metrics
- Engagement statistics
```

---

### 3. Smart Contracts (Clarity)

**Contract Suite:**

```clarity
passport-nft.clar          # SIP-12 Non-transferable NFTs
badge-metadata.clar        # Metadata storage with typed maps
badge-reader.clar          # Read-only query functions
badge-issuer.clar          # Issuance logic and authorization
access-control.clar        # Permission management
community-manager.clar     # Community operations
```

**Contract Interactions:**

```
Frontend → @stacks/transactions → Stacks API → Smart Contracts
                                     ↓
Backend  ← Chainhooks (Webhook) ← Stacks Events
```

---

### 4. Event Processing (Chainhooks)

**Purpose:** Monitor blockchain events and trigger backend actions

**Monitored Events:**
- Badge minting (`passport-nft.mint-badge`)
- Badge revocation (`badge-metadata.revoke-badge`)
- Community creation (`community-manager.create-community`)
- Metadata updates (`badge-metadata.update-metadata`)

**Workflow:**
```
1. Smart Contract Event Occurs
   ↓
2. Chainhook Detects Event
   ↓
3. POST to Backend Webhook Endpoint
   ↓
4. Backend Processes Event
   ↓
5. Update Database
   ↓
6. Send Real-time Notification
   ↓
7. Invalidate Cache
```

---

## Data Flow

### Badge Issuance Flow

```
User Request → Frontend
    ↓
Wallet Connection (WalletConnect)
    ↓
Sign Transaction
    ↓
Broadcast to Stacks
    ↓
Smart Contract Execution
    ↓
Chainhook Detection
    ↓
Backend Webhook Handler
    ↓
Database Update
    ↓
Notification Service
    ↓
Real-time Update to Frontend
    ↓
User Sees New Badge
```

### Authentication Flow

```
User Clicks "Connect Wallet"
    ↓
Frontend Requests Signature
    ↓
User Signs Message in Wallet
    ↓
Frontend Sends Signature + Address
    ↓
Backend Verifies Signature
    ↓
Generate JWT Token
    ↓
Store Session in Redis
    ↓
Return Token to Frontend
    ↓
Store in Local Storage
    ↓
Attach to All API Requests
```

---

## Database Schema

### MongoDB Collections

#### Users Collection
```javascript
{
  _id: ObjectId,
  stacksAddress: String (unique, indexed),
  name: String,
  bio: String,
  avatar: String,
  email: String,
  customUrl: String (unique),
  socialLinks: {
    twitter: String,
    github: String,
    linkedin: String,
    discord: String,
    website: String
  },
  themePreferences: {
    mode: String (light|dark|system),
    accentColor: String
  },
  notificationPreferences: {
    badgeReceived: Boolean,
    communityUpdates: Boolean,
    systemAnnouncements: Boolean,
    emailNotifications: Boolean,
    pushNotifications: Boolean
  },
  role: String (user|admin|superadmin),
  isPublic: Boolean,
  joinDate: Date,
  lastActive: Date,
  communities: [ObjectId],
  adminCommunities: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

#### Communities Collection
```javascript
{
  _id: ObjectId,
  name: String (indexed),
  slug: String (unique, indexed),
  description: String,
  about: String,
  website: String,
  admins: [String] (Stacks addresses, indexed),
  theme: {
    primaryColor: String,
    secondaryColor: String,
    backgroundColor: String,
    textColor: String,
    logo: Object,
    bannerImage: Object
  },
  settings: {
    isPublic: Boolean,
    requireApproval: Boolean,
    allowBadgeRequests: Boolean
  },
  socialLinks: Object,
  tags: [String] (indexed),
  memberCount: Number,
  badgeCount: Number,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Badges Collection
```javascript
{
  _id: ObjectId,
  badgeId: String (blockchain badge ID, unique, indexed),
  name: String,
  description: String,
  category: String (indexed),
  level: Number,
  issuer: String (Stacks address, indexed),
  recipient: String (Stacks address, indexed),
  communityId: ObjectId (indexed),
  imageUrl: String,
  metadataUri: String,
  metadata: Object,
  isActive: Boolean (indexed),
  issuedAt: Date,
  revokedAt: Date,
  transactionId: String,
  blockHeight: Number,
  createdAt: Date,
  updatedAt: Date
}
```

#### Notifications Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (indexed),
  type: String (indexed),
  title: String,
  message: String,
  data: Object,
  read: Boolean (indexed),
  createdAt: Date (indexed with TTL),
  expiresAt: Date
}
```

---

## Caching Strategy

### Redis Cache Layers

**Layer 1: User Data**
```
Key Pattern: user:{address}
TTL: 1 hour
Data: User profile, preferences, badge count
```

**Layer 2: Badge Data**
```
Key Pattern: badge:{id}
TTL: 6 hours
Data: Badge metadata, verification status
```

**Layer 3: Community Data**
```
Key Pattern: community:{id}
TTL: 30 minutes
Data: Community info, member count, settings
```

**Layer 4: Analytics**
```
Key Pattern: analytics:{type}:{id}:{date}
TTL: 24 hours
Data: Aggregated analytics, charts data
```

### Cache Invalidation

```javascript
// Event-driven invalidation
chainhookEvent('badge.minted') → invalidate('user:{recipient}:badges')
chainhookEvent('community.updated') → invalidate('community:{id}')
userUpdate() → invalidate('user:{address}')
```

---

## Security Architecture

### Authentication & Authorization

**Multi-Layer Security:**
1. **Wallet Signature Verification** - Cryptographic proof of ownership
2. **JWT Tokens** - Stateless session management
3. **Role-Based Access Control** - User/Admin/Superadmin permissions
4. **API Rate Limiting** - DDoS protection
5. **CORS Configuration** - Cross-origin restrictions

### Data Security

**Encryption:**
- Passwords: bcrypt (if used)
- Sensitive data: AES-256
- API keys: Environment variables
- Database: MongoDB encryption at rest

**Validation:**
- Input sanitization on all endpoints
- TypeScript type checking
- Mongoose schema validation
- Request payload size limits

---

## Performance Optimization

### Frontend Optimization

1. **Code Splitting**
   ```javascript
   // Dynamic imports
   const AnalyticsDashboard = dynamic(() => 
     import('@/components/analytics/AnalyticsDashboard')
   )
   ```

2. **Image Optimization**
   ```javascript
   <Image
     src={badge.imageUrl}
     width={300}
     height={300}
     priority={false}
     loading="lazy"
   />
   ```

3. **Static Generation**
   ```javascript
   export async function generateStaticParams() {
     return await fetchCommunities()
   }
   ```

### Backend Optimization

1. **Database Indexing**
   ```javascript
   userSchema.index({ stacksAddress: 1 })
   badgeSchema.index({ recipient: 1, isActive: 1 })
   communitySchema.index({ slug: 1 })
   ```

2. **Query Optimization**
   ```javascript
   // Use projection to limit fields
   User.findOne({ stacksAddress }, 'name avatar role')
   
   // Use lean() for read-only queries
   Badge.find({ recipient }).lean()
   ```

3. **Connection Pooling**
   ```javascript
   mongoose.connect(MONGODB_URI, {
     maxPoolSize: 10,
     minPoolSize: 5
   })
   ```

---

## Scalability Considerations

### Horizontal Scaling

**Load Balancing:**
```
     Nginx Load Balancer
           ↓
    ┌──────┼──────┐
    ↓      ↓      ↓
  API-1  API-2  API-3
    ↓      ↓      ↓
    └──────┼──────┘
           ↓
      MongoDB Cluster
```

### Microservices Migration Path

**Phase 1:** Monolithic (Current)
**Phase 2:** Service Separation
```
- Auth Service
- Badge Service
- Community Service
- Notification Service
- Analytics Service
```

**Phase 3:** Event-Driven Architecture
```
Services communicate via message queue (RabbitMQ/Kafka)
```

---

## Monitoring & Observability

### Metrics to Track

**Application Metrics:**
- API response times
- Error rates
- Request volumes
- Cache hit ratios

**Business Metrics:**
- Badge issuance rate
- User growth
- Community engagement
- Transaction success rate

**Infrastructure Metrics:**
- CPU usage
- Memory consumption
- Database query performance
- Network latency

### Logging Strategy

```javascript
// Structured logging
logger.info('Badge issued', {
  badgeId,
  recipient,
  issuer,
  timestamp: new Date(),
  transactionId
})
```

---

## Deployment Architecture

### Production Environment

```
┌─────────────────────────────────────┐
│         Vercel (Frontend)           │
│  - Next.js SSR/SSG                 │
│  - Edge Functions                   │
│  - CDN Distribution                 │
└─────────────────────────────────────┘
                ↕
┌─────────────────────────────────────┐
│     DigitalOcean/AWS (Backend)      │
│  - Node.js API Server              │
│  - MongoDB Database                 │
│  - Redis Cache                      │
│  - Nginx Reverse Proxy              │
└─────────────────────────────────────┘
                ↕
┌─────────────────────────────────────┐
│      Stacks Blockchain              │
│  - Smart Contracts                  │
│  - Chainhook Service                │
└─────────────────────────────────────┘
```

### CI/CD Pipeline

```
GitHub Push
    ↓
GitHub Actions
    ↓
Run Tests
    ↓
Build Application
    ↓
Deploy to Staging
    ↓
Run E2E Tests
    ↓
Deploy to Production
    ↓
Health Checks
```

---

## Disaster Recovery

### Backup Strategy

**Database Backups:**
- Full backup: Daily at 2 AM UTC
- Incremental backup: Every 6 hours
- Retention: 30 days
- Storage: AWS S3

**Configuration Backups:**
- Smart contract source code (Git)
- Environment variables (Encrypted vault)
- Infrastructure as Code (Terraform)

### Recovery Procedures

1. **Database Corruption:**
   - Restore from latest backup
   - Replay blockchain events via Chainhooks
   - Verify data integrity

2. **Smart Contract Issues:**
   - Cannot upgrade (immutable)
   - Deploy new version
   - Migrate data if necessary

3. **API Downtime:**
   - Automatic failover to backup instance
   - Load balancer health checks
   - Alert on-call team

---

## Future Enhancements

### Planned Features

1. **GraphQL API** - More efficient data fetching
2. **WebAuthn Support** - Passwordless authentication
3. **Mobile App** - Native iOS/Android apps
4. **Advanced Analytics** - ML-powered insights
5. **Multi-chain Support** - Expand beyond Stacks
6. **Federation** - Inter-community badge recognition

---

*Last updated: December 27, 2025*
