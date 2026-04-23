# Architecture

## System Design

### Microservices Architecture

The system is built on a microservices architecture with 6 independent services communicating via REST APIs and message queues.

#### Services

1. **API Gateway** (FastAPI)
   - Entry point for all client requests
   - Request/response logging
   - Authentication/Authorization
   - Rate limiting
   - CORS handling

2. **User Service**
   - User registration & authentication
   - Email verification
   - Profile management
   - JWT token generation

3. **Emotion & Memory Service** (combined)
   - Emotional profiling (Hyper/Hypo/Balanced)
   - Emotional history tracking
   - Session memory management
   - Resilient Zone state machine

4. **Safety Service** (independent)
   - Crisis detection (pre-check & post-check)
   - Harmful content filtering
   - Safety escalation logic
   - Never blocked by other services

5. **Knowledge Service**
   - SEEK skill definitions & techniques
   - Retrieval-augmented generation (RAG)
   - Dynamic prompt engineering
   - Fallback strategies

6. **Orchestrator Service**
   - Coordinates microservice calls
   - Parallel request execution (asyncio.gather)
   - Timeout management
   - Response aggregation

### Technology Stack

**Backend:**
- FastAPI (Python 3.11)
- Uvicorn (ASGI server)
- PyMongo (MongoDB driver)
- Redis (session/cache)
- Pydantic (validation)
- Poetry (dependency management)

**Frontend:**
- React (UI framework)
- Next.js (framework)
- TypeScript (type safety)
- Tailwind CSS (styling)
- Axios (HTTP client)

**Database & Cache:**
- MongoDB Atlas (primary data store)
- Redis ElastiCache (session & cache)
- FAISS (vector search, Phase 2)

**Infrastructure & Deployment:**
- AWS ECS Fargate (compute)
- AWS SQS (async logging)
- AWS Secrets Manager (secrets)
- AWS X-Ray (tracing)
- CloudWatch (monitoring & logs)
- GitHub Actions (CI/CD)

**LLM:**
- Google Gemini API (primary)
- Claude API (fallback)
- Template-based responses (fallback)

### Data Flow

```
Client Request
    ↓
API Gateway (CORS, Auth, Logging)
    ↓
Orchestrator Service
    ├→ User Service (get user context)
    ├→ Emotion & Memory Service (analyze emotional state)
    ├→ Safety Service (pre-check for crisis)
    ├→ Knowledge Service (retrieve SEEK techniques)
    └→ LLM Service (generate response)
    ↓
Safety Service (post-check)
    ↓
API Gateway (response + logging to SQS)
    ↓
Client Response
```

### Security

- JWT (stateless authentication)
- bcrypt (password hashing)
- HTTPS (TLS encryption in production)
- AWS Secrets Manager (credential management)
- Encrypted at rest & in transit
- SQL injection prevention (Pydantic validation)
- CORS protection
- Rate limiting per IP

### Resilience

- Independent microservices (no cascading failures)
- Safety service never blocked by others
- Fallback LLM strategies
- Async logging (never blocks requests)
- Health checks on all services
- Automatic retries with exponential backoff
- Circuit breaker pattern for external APIs

### Performance

- Target response latency: 2-4 seconds
- Parallel service execution (asyncio.gather)
- Redis caching for frequent queries
- Vertical scaling (Fargate task resources)
- Horizontal scaling (ECS task count)
- Connection pooling (MongoDB, Redis)

## Deployment

See [docs/SETUP.md](SETUP.md) for deployment instructions.
