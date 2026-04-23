# Security Guide

## Development Environment

### Credentials & Secrets

- ✅ All secrets in `.env` files (never committed)
- ✅ `.gitignore` configured to exclude `.env`
- ✅ Credentials stored in password manager (LastPass/1Password)
- ✅ AWS credentials managed by IAM users (not root account)
- ✅ Shared team vault for access

### Git Security

- ✅ `.env` files not committed
- ✅ `.gitignore` configured correctly
- ✅ No hardcoded secrets in code
- ✅ Regular git history audits

### Password Policy

- Minimum 12 characters for user passwords
- Mixed case, numbers, special characters
- AWS access keys rotated every 90 days
- Database passwords use strong generation

## Database Security

### MongoDB

- ✅ Encryption at rest enabled
- ✅ Encryption in transit (TLS)
- ✅ Authentication required (user/password)
- ✅ IP whitelisting (0.0.0.0/0 for development, specific IPs for production)
- ✅ Regular backups enabled

### Redis

- ✅ Encryption in transit enabled
- ✅ AUTH password required
- ✅ Security group restricts access
- ✅ No persistence to disk (SESSION data only)

## Application Security

### Authentication & Authorization

- JWT tokens with 24-hour expiry
- bcrypt password hashing (salt rounds: 12)
- Email verification required for registration
- No passwords stored in logs

### API Security

- CORS restricted to frontend domains
- Rate limiting per IP (100 requests/minute)
- Input validation (Pydantic schemas)
- Output encoding (prevent XSS)
- HTTPS enforced (production only)

### LLM Safety

- Pre-check: Crisis detection before LLM call
- Post-check: Response validation after LLM
- Harmful content filtering
- No user PII in LLM requests
- Response length limits

## AWS Security

### IAM

- ✅ Separate IAM user (empathy-dev, not root)
- ✅ Least privilege permissions
- ✅ MFA enabled (production)
- ✅ Regular audit of permissions

### Secrets Manager

- ✅ All secrets centralized in AWS Secrets Manager
- ✅ Automatic rotation enabled
- ✅ Encryption using AWS KMS
- ✅ Audit logging enabled

### Networking

- ✅ VPC configured
- ✅ Security groups restrict inbound traffic
- ✅ Private subnets for databases
- ✅ NAT Gateway for outbound traffic (production)

### Monitoring & Logging

- ✅ CloudWatch Logs enabled
- ✅ CloudWatch Alarms for high costs
- ✅ X-Ray distributed tracing
- ✅ API Gateway logging
- ✅ Failed auth attempts logged
- ✅ Log retention: 7 days (development), 30 days (production)

## GDPR & Data Privacy

### User Data Handling

- ✅ Only necessary data collected (email, name, school)
- ✅ User consent required before processing
- ✅ Data retention policy: Delete after 1 year of inactivity
- ✅ User has right to deletion

### Data Retention

- User data: 1 year (then deleted)
- Logs: 7 days (development), 30 days (production)
- Backups: 30 days
- Conversation history: Encrypted, deletable by user

### Right to Access

- Users can download their data via API
- Email export within 30 days
- No third-party data sharing

## Testing Security

### Before Deployment

- [ ] Run security scanner (bandit, safety)
- [ ] Dependency vulnerability check (pip audit, npm audit)
- [ ] Code review by peer
- [ ] Security testing (OWASP Top 10)
- [ ] Penetration testing (staging environment)

### Commands

```bash
# Backend security checks
cd backend
poetry run bandit -r . -ll
pip audit
poetry run safety check

# Frontend security checks
cd frontend
npm audit
npx snyk test
```

## Incident Response

### Breach Discovery

1. Immediately disable compromised credentials
2. Rotate all secrets
3. Review audit logs for unauthorized access
4. Notify affected users (if applicable)
5. Update security policies

### Emergency Contacts

- Security Lead: [Name & Email]
- AWS Support: [Account Number]
- Incident Response: [Contact]

## Compliance Checklist

- [ ] GDPR compliant
- [ ] Data encryption at rest & in transit
- [ ] Access logging enabled
- [ ] Secrets not in git
- [ ] Regular security audits
- [ ] Incident response plan
- [ ] User privacy policy published
- [ ] Terms of service up to date
