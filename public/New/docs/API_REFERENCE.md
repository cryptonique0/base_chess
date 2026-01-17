# PassportX API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Badge APIs](#badge-apis)
4. [Community APIs](#community-apis)
5. [User APIs](#user-apis)
6. [Analytics APIs](#analytics-apis)
7. [Notification APIs](#notification-apis)
8. [Error Handling](#error-handling)
9. [Rate Limiting](#rate-limiting)
10. [Webhooks](#webhooks)

---

## Overview

**Base URL**: `https://api.passportx.io` (Production)  
**Base URL**: `http://localhost:3001/api` (Development)

**API Version**: v1.0  
**Protocol**: REST  
**Response Format**: JSON  
**Authentication**: JWT Bearer Token

---

## Authentication

### Login with Stacks Wallet

Authenticate using Stacks wallet signature.

**Endpoint**: `POST /auth/login`

**Request Body**:
```json
{
  "stacksAddress": "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
  "signature": "0x...",
  "message": "PassportX Authentication\nAddress: SP2J6...\nNonce: abc123\nTimestamp: 1703624400000",
  "publicKey": "03..."
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "stacksAddress": "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
      "name": "John Doe",
      "avatar": "https://...",
      "role": "user"
    },
    "expiresAt": "2025-01-03T12:00:00Z"
  }
}
```

### Get Current User

**Endpoint**: `GET /auth/me`  
**Auth Required**: Yes

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "stacksAddress": "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
    "name": "John Doe",
    "bio": "Web3 enthusiast",
    "avatar": "https://...",
    "email": "john@example.com",
    "role": "user",
    "isPublic": true,
    "joinDate": "2024-01-15T10:30:00Z",
    "communities": ["comm-id-1", "comm-id-2"],
    "adminCommunities": ["comm-id-3"]
  }
}
```

### Logout

**Endpoint**: `POST /auth/logout`  
**Auth Required**: Yes

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Badge APIs

### Get Badge by ID

**Endpoint**: `GET /badges/:id`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "badge-123",
    "name": "Web3 Pioneer",
    "description": "Completed first DeFi transaction",
    "category": "achievement",
    "level": 3,
    "issuer": {
      "address": "SP...",
      "name": "DeFi Academy",
      "communityId": "comm-456"
    },
    "recipient": "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
    "imageUrl": "https://ipfs.io/ipfs/...",
    "issuedAt": "2024-12-01T10:00:00Z",
    "isActive": true,
    "metadata": {
      "skill": "DeFi",
      "verificationUrl": "https://..."
    }
  }
}
```

### List User Badges

**Endpoint**: `GET /users/:address/badges`

**Query Parameters**:
- `category` (optional): Filter by category
- `isActive` (optional): Filter active badges (default: true)
- `limit` (optional): Results per page (default: 20, max: 100)
- `offset` (optional): Pagination offset (default: 0)

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "badge-123",
      "name": "Web3 Pioneer",
      "category": "achievement",
      "level": 3,
      "imageUrl": "https://...",
      "issuedAt": "2024-12-01T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 45,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

### Issue Badge

**Endpoint**: `POST /badges/issue`  
**Auth Required**: Yes (Issuer role)

**Request Body**:
```json
{
  "recipientAddress": "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
  "templateId": "template-789",
  "customMetadata": {
    "completionDate": "2024-12-15",
    "score": 95
  }
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "badgeId": "badge-new-123",
    "transactionId": "0xabc...",
    "status": "pending",
    "estimatedConfirmation": "2-5 minutes"
  }
}
```

### Batch Issue Badges

**Endpoint**: `POST /badges/batch-issue`  
**Auth Required**: Yes (Admin role)

**Request Body**:
```json
{
  "recipients": [
    "SP2J6ZY...",
    "SP3K7L...",
    "SP4M8N..."
  ],
  "templateId": "template-789",
  "customMetadata": {
    "event": "Hackathon 2024",
    "achievement": "Participant"
  }
}
```

**Response** (202 Accepted):
```json
{
  "success": true,
  "data": {
    "batchId": "batch-xyz-123",
    "recipientCount": 3,
    "status": "processing",
    "estimatedCompletion": "5-10 minutes"
  }
}
```

### Verify Badge

**Endpoint**: `GET /badges/:id/verify`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "isValid": true,
    "isActive": true,
    "owner": "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
    "issuer": "SP101YT8S9464KE0S0TQDGWV83V5H3A37DKEFYSJ0",
    "issuedAt": "2024-12-01T10:00:00Z",
    "blockHeight": 123456,
    "transactionId": "0xabc..."
  }
}
```

### Revoke Badge

**Endpoint**: `POST /badges/:id/revoke`  
**Auth Required**: Yes (Issuer/Admin)

**Request Body**:
```json
{
  "reason": "Violation of community guidelines"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Badge revoked successfully",
  "data": {
    "badgeId": "badge-123",
    "revokedAt": "2024-12-27T10:00:00Z",
    "revokedBy": "SP101..."
  }
}
```

---

## Community APIs

### Create Community

**Endpoint**: `POST /communities`  
**Auth Required**: Yes

**Request Body**:
```json
{
  "name": "Web3 Builders",
  "slug": "web3-builders",
  "description": "A community for Web3 developers and enthusiasts",
  "about": "Detailed information about the community...",
  "website": "https://web3builders.com",
  "theme": {
    "primaryColor": "#3b82f6",
    "secondaryColor": "#10b981",
    "logo": "https://..."
  },
  "settings": {
    "isPublic": true,
    "requireApproval": false,
    "allowBadgeRequests": true
  },
  "socialLinks": {
    "twitter": "https://twitter.com/web3builders",
    "discord": "https://discord.gg/..."
  },
  "tags": ["web3", "blockchain", "development"]
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "comm-new-123",
    "name": "Web3 Builders",
    "slug": "web3-builders",
    "createdAt": "2024-12-27T10:00:00Z",
    "adminAddress": "SP2J6ZY..."
  }
}
```

### Get Community

**Endpoint**: `GET /communities/:idOrSlug`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "comm-123",
    "name": "Web3 Builders",
    "slug": "web3-builders",
    "description": "A community for Web3 developers",
    "about": "Detailed information...",
    "memberCount": 1250,
    "badgeCount": 3420,
    "admins": ["SP2J6ZY...", "SP3K7L..."],
    "theme": {...},
    "socialLinks": {...},
    "isPublic": true,
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

### List Communities

**Endpoint**: `GET /communities`

**Query Parameters**:
- `search` (optional): Search by name or description
- `tags` (optional): Filter by tags (comma-separated)
- `admin` (optional): Filter by admin address
- `limit` (optional): Results per page (default: 20)
- `offset` (optional): Pagination offset (default: 0)

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "comm-123",
      "name": "Web3 Builders",
      "slug": "web3-builders",
      "description": "A community for Web3 developers",
      "memberCount": 1250,
      "badgeCount": 3420,
      "logoUrl": "https://..."
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

### Update Community

**Endpoint**: `PATCH /communities/:id`  
**Auth Required**: Yes (Admin)

**Request Body** (all fields optional):
```json
{
  "description": "Updated description",
  "theme": {
    "primaryColor": "#4f46e5"
  },
  "settings": {
    "requireApproval": true
  }
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "comm-123",
    "updatedAt": "2024-12-27T11:00:00Z"
  }
}
```

### Add Community Member

**Endpoint**: `POST /communities/:id/members`  
**Auth Required**: Yes

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Added to community successfully"
}
```

### Remove Community Member

**Endpoint**: `DELETE /communities/:id/members/:address`  
**Auth Required**: Yes (Admin)

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Member removed successfully"
}
```

---

## User APIs

### Get User Profile

**Endpoint**: `GET /users/:address`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "stacksAddress": "SP2J6ZY...",
    "name": "John Doe",
    "bio": "Web3 enthusiast",
    "avatar": "https://...",
    "customUrl": "johndoe",
    "isPublic": true,
    "joinDate": "2024-01-15T10:00:00Z",
    "stats": {
      "totalBadges": 45,
      "activeBadges": 42,
      "communities": 8,
      "adminCommunities": 2
    },
    "socialLinks": {
      "twitter": "https://twitter.com/johndoe",
      "github": "https://github.com/johndoe"
    }
  }
}
```

### Update User Profile

**Endpoint**: `PATCH /users/:address`  
**Auth Required**: Yes (Own profile)

**Request Body**:
```json
{
  "name": "John Smith",
  "bio": "Updated bio",
  "avatar": "https://newavatar.com/image.png",
  "socialLinks": {
    "twitter": "https://twitter.com/johnsmith"
  }
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "stacksAddress": "SP2J6ZY...",
    "updatedAt": "2024-12-27T11:00:00Z"
  }
}
```

---

## Analytics APIs

### Get Community Analytics

**Endpoint**: `GET /communities/:id/analytics`  
**Auth Required**: Yes (Admin)

**Query Parameters**:
- `startDate` (optional): Start date (ISO 8601)
- `endDate` (optional): End date (ISO 8601)
- `granularity` (optional): daily|weekly|monthly (default: daily)

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalMembers": 1250,
      "activeBadges": 3420,
      "newMembers": 150,
      "badgesIssued": 340
    },
    "growth": [
      {
        "date": "2024-12-20",
        "members": 1200,
        "badges": 3100
      },
      {
        "date": "2024-12-27",
        "members": 1250,
        "badges": 3420
      }
    ],
    "topCategories": [
      { "category": "achievement", "count": 1234 },
      { "category": "skill", "count": 987 }
    ]
  }
}
```

### Get User Analytics

**Endpoint**: `GET /users/:address/analytics`  
**Auth Required**: Yes (Own profile or admin)

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "badgeDistribution": {
      "achievement": 25,
      "skill": 12,
      "participation": 8
    },
    "recentActivity": [
      {
        "type": "badge_received",
        "badgeId": "badge-123",
        "date": "2024-12-25T10:00:00Z"
      }
    ],
    "communitiesActive": 5,
    "totalPoints": 1250
  }
}
```

---

## Notification APIs

### Get Notifications

**Endpoint**: `GET /notifications`  
**Auth Required**: Yes

**Query Parameters**:
- `type` (optional): Filter by type
- `read` (optional): Filter by read status (true/false)
- `limit` (optional): Results per page (default: 20)
- `offset` (optional): Pagination offset (default: 0)

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "notif-123",
      "type": "badge_received",
      "title": "New Badge Received!",
      "message": "You received the 'Web3 Pioneer' badge",
      "data": {
        "badgeId": "badge-123",
        "badgeName": "Web3 Pioneer"
      },
      "read": false,
      "createdAt": "2024-12-27T09:00:00Z"
    }
  ],
  "unreadCount": 5,
  "pagination": {
    "total": 45,
    "limit": 20,
    "offset": 0
  }
}
```

### Mark Notification as Read

**Endpoint**: `PATCH /notifications/:id/read`  
**Auth Required**: Yes

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

### Mark All as Read

**Endpoint**: `POST /notifications/mark-all-read`  
**Auth Required**: Yes

**Response** (200 OK):
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

---

## Error Handling

### Error Response Format

All errors follow this structure:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

### HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created successfully |
| 202 | Accepted - Request accepted for processing |
| 400 | Bad Request - Invalid request parameters |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |
| 503 | Service Unavailable - Service temporarily unavailable |

### Common Error Codes

| Code | Description |
|------|-------------|
| `INVALID_ADDRESS` | Invalid Stacks address format |
| `INVALID_SIGNATURE` | Signature verification failed |
| `TOKEN_EXPIRED` | JWT token has expired |
| `INSUFFICIENT_PERMISSIONS` | User lacks required permissions |
| `RESOURCE_NOT_FOUND` | Requested resource not found |
| `DUPLICATE_RESOURCE` | Resource already exists |
| `RATE_LIMIT_EXCEEDED` | API rate limit exceeded |
| `BLOCKCHAIN_ERROR` | Blockchain interaction failed |

---

## Rate Limiting

### Limits

- **Public endpoints**: 100 requests per minute
- **Authenticated endpoints**: 500 requests per minute
- **Admin endpoints**: 1000 requests per minute

### Headers

```
X-RateLimit-Limit: 500
X-RateLimit-Remaining: 495
X-RateLimit-Reset: 1703627400
```

### Rate Limit Exceeded Response

```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 60
}
```

---

## Webhooks

### Chainhook Events

PassportX can send webhook notifications for blockchain events.

#### Badge Minted

**Event**: `badge.minted`

```json
{
  "event": "badge.minted",
  "timestamp": "2024-12-27T10:00:00Z",
  "data": {
    "badgeId": "badge-123",
    "recipient": "SP2J6ZY...",
    "issuer": "SP101...",
    "transactionId": "0xabc...",
    "blockHeight": 123456
  }
}
```

#### Badge Revoked

**Event**: `badge.revoked`

```json
{
  "event": "badge.revoked",
  "timestamp": "2024-12-27T10:00:00Z",
  "data": {
    "badgeId": "badge-123",
    "revokedBy": "SP101...",
    "reason": "Policy violation"
  }
}
```

#### Community Created

**Event**: `community.created`

```json
{
  "event": "community.created",
  "timestamp": "2024-12-27T10:00:00Z",
  "data": {
    "communityId": "comm-123",
    "name": "Web3 Builders",
    "admin": "SP2J6ZY..."
  }
}
```

---

## SDK Examples

### JavaScript/TypeScript

```typescript
import { PassportXClient } from '@passportx/sdk';

const client = new PassportXClient({
  apiKey: 'your-api-key',
  network: 'mainnet'
});

// Get user badges
const badges = await client.users.getBadges('SP2J6ZY...');

// Issue a badge
const result = await client.badges.issue({
  recipient: 'SP2J6ZY...',
  templateId: 'template-789'
});
```

---

## Support

- **API Status**: https://status.passportx.io
- **Documentation**: https://docs.passportx.io
- **Support Email**: api-support@passportx.io

---

*Last updated: December 27, 2025*
