# 📈 Marine Care - Scalability Strategies

> **Comprehensive Guide to Scaling from MVP to Enterprise Level**

**Document Version:** 2.0  
**Last Updated:** January 2026  
**Purpose:** Understanding Scalability Patterns for System Design Interviews

---

## Table of Contents

1. [Current State Analysis](#current-state-analysis)
2. [Scalability Dimensions](#scalability-dimensions)
3. [Horizontal vs Vertical Scaling](#horizontal-vs-vertical-scaling)
4. [Database Scaling Strategies](#database-scaling-strategies)
5. [Caching Strategies](#caching-strategies)
6. [Load Balancing](#load-balancing)
7. [Microservices Migration Path](#microservices-migration-path)
8. [Event-Driven Architecture](#event-driven-architecture)
9. [CDN and Asset Optimization](#cdn-and-asset-optimization)
10. [Monitoring and Observability](#monitoring-and-observability)
11. [Capacity Planning](#capacity-planning)
12. [Cost Optimization](#cost-optimization)

---

## Current State Analysis

### MVP Architecture (Current)

```
┌─────────────┐
│   Users     │
│  (<1000)    │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐
│  Frontend   │────▶│   Backend   │
│   (Vercel)  │     │  (Railway)  │
│  Static CDN │     │ Single Node │
└─────────────┘     └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   MongoDB   │
                    │    Atlas    │
                    │ Free Tier   │
                    │  (512MB)    │
                    └─────────────┘

Characteristics:
├── Single backend instance
├── No load balancing
├── No caching layer
├── Direct database queries
├── GridFS for images (single DB)
└── Suitable for: < 1,000 concurrent users
```

### Current Bottlenecks

| Component | Current Limit | Bottleneck | Impact |
|-----------|---------------|------------|--------|
| **Backend API** | ~100 req/sec | Single Node.js process | Response time degrades |
| **Database** | 512MB storage | Free tier limits | Connection exhaustion |
| **GridFS** | Embedded in DB | No dedicated storage | Slow image retrieval |
| **AI Service** | Serial processing | Single model instance | Queue builds up |
| **Authentication** | Firebase free tier | 50K MAU limit | Authentication failures |

### Performance Metrics (Current)

```
Metric                    Current Value    Target (Scaled)
────────────────────────────────────────────────────────────
Avg Response Time         ~200ms           <100ms
P99 Response Time         ~800ms           <300ms
Max Concurrent Users      ~500             10,000+
Database Connections      100              1,000+
Image Upload Time         ~2-3 sec         <1 sec
AI Classification Time    ~1-2 sec         <500ms
Uptime                    99%              99.99%
```

---

## Scalability Dimensions

### 1. Traffic Scaling

```
Current:  1,000 DAU (Daily Active Users)
Target:   100,000+ DAU

Growth Stages:
┌─────────────────────────────────────────────────────────┐
│  Stage 1: MVP (Current)                                 │
│  - 1,000 DAU                                            │
│  - Single backend instance                              │
│  - Free tier database                                   │
│  Cost: $0/month                                         │
└─────────────────────────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────┐
│  Stage 2: Early Growth                                  │
│  - 10,000 DAU                                           │
│  - 2-3 backend instances                                │
│  - Paid database tier                                   │
│  - Redis caching                                        │
│  Cost: $200-500/month                                   │
└─────────────────────────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────┐
│  Stage 3: Scale-up                                      │
│  - 100,000 DAU                                          │
│  - Auto-scaling (5-20 instances)                        │
│  - Database cluster (replica set)                       │
│  - CDN for static assets                                │
│  - Separate image storage (S3)                          │
│  Cost: $2,000-5,000/month                               │
└─────────────────────────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────┐
│  Stage 4: Enterprise                                    │
│  - 1,000,000+ DAU                                       │
│  - Microservices architecture                           │
│  - Multi-region deployment                              │
│  - Sharded database                                     │
│  - Event-driven messaging                               │
│  Cost: $20,000+/month                                   │
└─────────────────────────────────────────────────────────┘
```

### 2. Data Scaling

```
Data Growth Projection:
────────────────────────────────────────────────────
Year 1:  100K users × 10 cleanups  = 1M cleanups
Year 2:  500K users × 20 cleanups  = 10M cleanups
Year 3:  2M users × 30 cleanups    = 60M cleanups

Storage Calculation:
────────────────────────────────────────────────────
Image per cleanup:    ~500KB (compressed)
Metadata per cleanup: ~1KB
Total per cleanup:    ~501KB

Year 1: 1M × 501KB    = ~500GB
Year 2: 10M × 501KB   = ~5TB
Year 3: 60M × 501KB   = ~30TB
```

---

## Horizontal vs Vertical Scaling

### Vertical Scaling (Scale Up)

**Definition**: Increasing resources of a single machine.

```
Current:    1 server × 1 CPU × 2GB RAM
Scaled:     1 server × 8 CPU × 32GB RAM

Pros:
✓ Simple implementation
✓ No code changes needed
✓ Lower network latency
✓ Easier to manage

Cons:
✗ Hardware limits
✗ Single point of failure
✗ Expensive beyond certain point
✗ Requires downtime for upgrades
```

### Horizontal Scaling (Scale Out)

**Definition**: Adding more machines to distribute load.

```
Current:    1 server
Scaled:     10+ servers behind load balancer

Pros:
✓ Nearly infinite scaling
✓ No single point of failure
✓ Cost-effective at scale
✓ Rolling updates (zero downtime)

Cons:
✗ Complex to implement
✗ Requires stateless design
✗ Network overhead
✗ Distributed system challenges
```

### Hybrid Approach (Recommended)

```
┌──────────────────────────────────────────────────────┐
│  Phase 1: Vertical scaling                           │
│  - Upgrade to 4 CPU / 8GB RAM                        │
│  - Quick win, handles 5,000-10,000 users             │
│  Cost: $50-100/month                                 │
└──────────────────────────────────────────────────────┘
                        ▼
┌──────────────────────────────────────────────────────┐
│  Phase 2: Horizontal scaling                         │
│  - 3-5 backend instances                             │
│  - Load balancer                                     │
│  - Handles 50,000+ users                             │
│  Cost: $300-500/month                                │
└──────────────────────────────────────────────────────┘
```

---

## Database Scaling Strategies

### 1. Read Replicas

**Problem**: Too many read queries slow down primary database.

**Solution**: Replicate data to read-only secondaries.

```
┌──────────────────────────────────────────────────────┐
│                Application Layer                      │
└─────┬────────────────────────────────────────┬───────┘
      │                                        │
      │ Writes                                 │ Reads
      ▼                                        ▼
┌─────────────┐                        ┌─────────────┐
│   PRIMARY   │──────replication──────▶│  SECONDARY  │
│  MongoDB    │                        │  (Read-only)│
│  (Writes)   │                        │   Replica 1 │
└─────────────┘                        └─────────────┘
                                                │
                                       ┌────────┴─────────┐
                                       ▼                  ▼
                                ┌─────────────┐   ┌─────────────┐
                                │  SECONDARY  │   │  SECONDARY  │
                                │  (Read-only)│   │  (Read-only)│
                                │   Replica 2 │   │   Replica 3 │
                                └─────────────┘   └─────────────┘

Benefits:
- Read scalability (distribute load)
- High availability (failover)
- Geographic distribution

Implementation:
const writeDB = mongoose.createConnection(MONGO_URI_PRIMARY);
const readDB = mongoose.createConnection(MONGO_URI_SECONDARY);

// Write operations
await User.create({ ...data });

// Read operations
await User.findOne({ ...query }).setOptions({ read: 'secondary' });
```

### 2. Database Sharding

**Problem**: Single database can't handle data volume.

**Solution**: Split data across multiple databases.

```
Sharding Strategy: By Province

┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│            (Sharding Logic / Router)                         │
└──────┬──────────┬──────────┬──────────┬──────────┬─────────┘
       │          │          │          │          │
       ▼          ▼          ▼          ▼          ▼
  ┌─────────┐┌─────────┐┌─────────┐┌─────────┐┌─────────┐
  │ Shard 1 ││ Shard 2 ││ Shard 3 ││ Shard 4 ││ Shard 5 │
  │ Ontario ││ British ││ Alberta ││ Quebec  ││ Others  │
  │         ││ Columbia││         ││         ││         │
  └─────────┘└─────────┘└─────────┘└─────────┘└─────────┘

Sharding Key: province field

Implementation:
class ShardRouter {
    constructor() {
        this.shards = {
            'ON': mongooseConnection1,
            'BC': mongooseConnection2,
            'AB': mongooseConnection3,
            'QC': mongooseConnection4,
            'default': mongooseConnection5
        };
    }
    
    getConnection(province) {
        return this.shards[province] || this.shards['default'];
    }
}

const router = new ShardRouter();
const db = router.getConnection(user.province);
await db.model('Cleanup').create({ ...data });
```

### 3. Database Indexing Optimization

```javascript
// Current indexes
userSchema.index({ firebaseUid: 1 });
userSchema.index({ email: 1 });
userSchema.index({ totalItemsCollected: -1 });

// Additional indexes for scale
userSchema.index({ province: 1, totalItemsCollected: -1 }); // Compound
challengeSchema.index({ status: 1, startDate: -1 }); // Filtered queries
cleanupSchema.index({ userId: 1, createdAt: -1 }, { partialFilterExpression: { status: 'completed' } }); // Partial

// Index statistics monitoring
db.collection.getIndexes();
db.collection.aggregate([{ $indexStats: {} }]);
```

### 4. Database Connection Pooling

```javascript
// Poor: Creating new connection for each request
export const handler = async (req, res) => {
    const db = await mongoose.connect(MONGO_URI);
    // ... use db
    await db.close();
};

// Better: Connection pooling
mongoose.connect(MONGO_URI, {
    maxPoolSize: 100,        // Max connections
    minPoolSize: 10,         // Min connections
    maxIdleTimeMS: 30000,    // Close idle connections
    waitQueueTimeoutMS: 5000 // Wait time for connection
});

// Monitor pool
mongoose.connection.on('connected', () => {
    console.log('Pool size:', mongoose.connection.client.s.topology.s.pool.totalConnectionCount);
});
```

---

## Caching Strategies

### 1. Multi-Layer Caching

```
Request Flow with Caching:
───────────────────────────────────────────────────────────
Client Request
     │
     ▼
┌────────────────┐  HIT   ┌─────────────────────────────┐
│ Browser Cache  │───────▶│ Return cached data (instant)│
└────────┬───────┘        └─────────────────────────────┘
         │ MISS
         ▼
┌────────────────┐  HIT   ┌─────────────────────────────┐
│   CDN Cache    │───────▶│ Return cached data (~50ms)  │
└────────┬───────┘        └─────────────────────────────┘
         │ MISS
         ▼
┌────────────────┐  HIT   ┌─────────────────────────────┐
│  Redis Cache   │───────▶│ Return cached data (~5ms)   │
│ (Application)  │        │                             │
└────────┬───────┘        └─────────────────────────────┘
         │ MISS
         ▼
┌────────────────┐        ┌─────────────────────────────┐
│   MongoDB      │───────▶│ Return fresh data (~50ms)   │
│   (Database)   │        │ Update all caches           │
└────────────────┘        └─────────────────────────────┘
```

### 2. Redis Caching Implementation

```javascript
import Redis from 'ioredis';

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    enableOfflineQueue: false
});

/**
 * Cache wrapper with TTL
 */
async function cacheGet(key, fetchFunction, ttl = 300) {
    try {
        // Try cache first
        const cached = await redis.get(key);
        if (cached) {
            console.log(`[Cache] HIT: ${key}`);
            return JSON.parse(cached);
        }
        
        // Cache miss - fetch data
        console.log(`[Cache] MISS: ${key}`);
        const data = await fetchFunction();
        
        // Store in cache
        await redis.setex(key, ttl, JSON.stringify(data));
        
        return data;
        
    } catch (error) {
        console.error('[Cache] Error:', error);
        // Fallback to direct fetch
        return fetchFunction();
    }
}

/**
 * Usage in controllers
 */
export const getDashboardStats = async (req, res) => {
    const userId = req.mongoUser._id;
    const cacheKey = `dashboard:stats:${userId}`;
    
    const stats = await cacheGet(
        cacheKey,
        async () => {
            // Expensive database queries
            const [userStats, monthlyProgress, wasteDistribution] = await Promise.all([
                User.findById(userId).lean(),
                getMonthlyProgress(userId),
                getWasteDistribution(userId)
            ]);
            
            return { userStats, monthlyProgress, wasteDistribution };
        },
        300 // 5 minute TTL
    );
    
    res.json(stats);
};

/**
 * Cache invalidation
 */
export const uploadCleanup = async (req, res) => {
    // ... create cleanup ...
    
    // Invalidate related caches
    await Promise.all([
        redis.del(`dashboard:stats:${req.mongoUser._id}`),
        redis.del(`challenge:${challengeId}`),
        redis.del('leaderboard:top100')
    ]);
    
    res.json({ success: true });
};
```

### 3. CDN for Static Assets

```
Without CDN:
User (Australia) → Server (USA) → 300ms latency

With CDN:
User (Australia) → CDN Edge (Sydney) → 20ms latency

Implementation:
1. Upload static assets to CDN
2. Update image URLs to CDN
3. Set cache headers

// Next.js configuration
module.exports = {
    images: {
        domains: ['cdn.marinecare.com'],
        loader: 'cloudinary',
    },
    assetPrefix: process.env.NODE_ENV === 'production' 
        ? 'https://cdn.marinecare.com' 
        : ''
};
```

---

## Load Balancing

### Load Balancer Architecture

```
┌─────────────┐
│   Internet  │
└──────┬──────┘
       │
       ▼
┌────────────────────────────────────────────┐
│        Load Balancer (Nginx/ALB)           │
│                                            │
│  Algorithms:                               │
│  - Round Robin (default)                   │
│  - Least Connections (for long requests)   │
│  - IP Hash (sticky sessions)               │
└──────┬──────┬──────┬──────┬───────────────┘
       │      │      │      │
       ▼      ▼      ▼      ▼
  ┌────────┐┌────────┐┌────────┐┌────────┐
  │Backend ││Backend ││Backend ││Backend │
  │Node 1  ││Node 2  ││Node 3  ││Node 4  │
  │        ││        ││        ││        │
  │Health: ││Health: ││Health: ││Health: │
  │  ✓     ││  ✓     ││  ✓     ││  ✗     │
  └────┬───┘└────┬───┘└────┬───┘└────┬───┘
       │         │         │         │
       └─────────┴─────────┴─────────┘
                 │
                 ▼
          ┌─────────────┐
          │   MongoDB   │
          │   Cluster   │
          └─────────────┘

Health Check Configuration:
- Endpoint: GET /health
- Interval: 10 seconds
- Timeout: 3 seconds
- Unhealthy threshold: 2 failures
- Healthy threshold: 3 successes
```

### Implementation

```javascript
// Express health check endpoint
app.get('/health', async (req, res) => {
    try {
        // Check database connection
        await mongoose.connection.db.admin().ping();
        
        // Check Redis connection (if applicable)
        if (redis) {
            await redis.ping();
        }
        
        res.status(200).json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: process.memoryUsage()
        });
        
    } catch (error) {
        res.status(503).json({
            status: 'unhealthy',
            error: error.message
        });
    }
});

// Nginx configuration
upstream backend {
    least_conn; # Load balancing algorithm
    
    server backend1.example.com:5000 weight=3 max_fails=3 fail_timeout=30s;
    server backend2.example.com:5000 weight=3 max_fails=3 fail_timeout=30s;
    server backend3.example.com:5000 weight=2 max_fails=3 fail_timeout=30s;
    server backend4.example.com:5000 backup; # Backup server
}

server {
    listen 80;
    
    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # Timeout settings
        proxy_connect_timeout 5s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Health check
        health_check interval=10s fails=2 passes=3 uri=/health;
    }
}
```

---

## (Document continues... This is approximately 40% of the content)
