# IP-Based Rate Limiter (Node.js + Redis)

A rate limiter that restricts requests per IP using Redis for persistence and scalability.

## 🔧 Stack
- Node.js
- Express.js
- Redis
- rate-limiter-flexible

## 🚀 Features
- Limits 100 requests per IP every 15 minutes - default endpoint 
- Blocks IP for 15 minutes if exceeded
- Rate limit store via Redis
- Provides possiblity to update limits - endpoint - /admin/update-rate-limit

## 📦 Installation

```bash
git clone https://github.com/sivakarthik287/rate-limiter.git
cd rate-limiter
npm install
