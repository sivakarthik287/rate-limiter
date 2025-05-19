# IP-Based Rate Limiter (Node.js + Redis)

A rate limiter that restricts requests per IP using Redis for persistence and scalability.

## 🔧 Stack
- Node.js
- Express.js
- Redis
- rate-limiter-flexible

## 🚀 Features
- Limits 100 requests per IP every 15 minutes
- Blocks IP for 15 minutes if exceeded
- Centralized rate limit store via Redis

## 📦 Installation

```bash
git clone https://github.com/sivakarthik287/rate-limiter.git
cd rate-limiter
npm install
