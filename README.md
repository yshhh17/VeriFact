VeriFact

AI-powered dual-detection system to identify AI-generated content and verify factual claims. Combat misinformation with intelligent content analysis.
Overview

VeriFact analyzes text, images, and videos to provide:

    AI generation detection (Human vs AI-created)
    Fact-checking with multi-source verification
    Risk assessment (Trusted, Fake News, AI Misinformation)
    Confidence scoring and detailed analysis
    Detection history and management

Tech Stack
Backend

    Node.js + Express.js
    MongoDB with Mongoose ODM
    Redis for OTP management
    JWT authentication
    ES6 modules

AI & Detection

    Hugging Face API (text/image AI detection)
    Tesseract.js (OCR for images)
    FFmpeg (video frame extraction)
    BLIP model (image captioning)

Fact-Checking (100% Free APIs)

    Wikipedia API
    DuckDuckGo Instant Answer
    Wikidata
    OpenStreetMap Nominatim
    REST Countries API
    Web scraping (Snopes)

Email & Security

    Nodemailer (Gmail)
    bcryptjs (password hashing)
    Redis OTP system (10-min expiry)

Quick Start
Prerequisites
bash

# Install MongoDB
brew install mongodb-community  # macOS
sudo apt-get install mongodb    # Linux

# Install Redis
brew install redis              # macOS
sudo apt-get install redis      # Linux

# Install FFmpeg
brew install ffmpeg             # macOS
sudo apt-get install ffmpeg     # Linux

Installation
bash

# Clone repository
git clone https://github.com/yshhh17/verifact.git
cd verifact/backend

# Install dependencies
npm install

# Install additional packages
npm install tesseract.js fluent-ffmpeg cheerio

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Start MongoDB & Redis
mongod
redis-server

# Start development server
npm run dev

Environment Variables
env

# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/verifact

# JWT
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRE=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Email (Gmail App Password)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password

# Hugging Face API
HUGGING_FACE_API_KEY=your_hf_token

# Frontend
CLIENT_URL=http://localhost:3000

API Usage
Authentication

Register User
bash

POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Verify Email
bash

POST /api/auth/verify-email
{
  "email": "john@example.com",
  "otp": "123456"
}

Login
bash

POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}

Detection

Detect Text
bash

POST /api/detect/text
Authorization: Bearer {token}
{
  "text": "The Eiffel Tower collapsed yesterday in Paris."
}

Detect Image
bash

POST /api/detect/image
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [image file]

Detect Video
bash

POST /api/detect/video
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [video file]

Get History
bash

GET /api/detect/history?page=1&limit=10
Authorization: Bearer {token}

API Endpoints
Method	Endpoint	Access	Description
POST	/api/auth/register	Public	Register user
POST	/api/auth/verify-email	Public	Verify OTP
POST	/api/auth/login	Public	Login
GET	/api/auth/me	Private	Get user
POST	/api/detect/text	Private	Detect text
POST	/api/detect/image	Private	Detect image
POST	/api/detect/video	Private	Detect video
GET	/api/detect/history	Private	Get history
DELETE	/api/detect/:id	Private	Delete detection
Result Categories
AI Check	Fact Check	Verdict	Risk
✅ Human	✅ Verified	Trusted Content	🟢 Low
✅ Human	❌ False	Real Fake News	🔴 High
⚠️ AI	✅ Verified	AI but Accurate	🟡 Medium
⚠️ AI	❌ False	AI Misinformation	🔴 Critical
Project Structure
Code

backend/
├── config/
│   ├── db.js                 # MongoDB connection
│   └── redis.js              # Redis connection
├── controllers/
│   ├── authController.js     # Auth logic
│   └── detectionController.js # Detection logic
├── middleware/
│   ├── auth.js               # JWT middleware
│   ├── upload.js             # File upload
│   ├── ocr.js                # OCR extraction
│   ├── imageCaptioning.js    # Image captioning
│   └── videoProcessor.js     # Video processing
├── models/
│   ├── User.js               # User schema
│   └── Detection.js          # Detection schema
├── routes/
│   ├── authRoutes.js         # Auth routes
│   └── detectionRoutes.js    # Detection routes
├── utils/
│   ├── aiDetector.js         # AI detection
│   ├── factChecker.js        # Fact-checking
│   ├── claimExtractor.js     # Claim extraction
│   ├── sendEmail.js          # Email utility
│   └── generateOTP.js        # OTP generator
├── uploads/                  # Uploaded files
├── .env                      # Environment vars
├── server.js                 # Express server
└── package.json              # Dependencies

Key Features

    Dual-Layer Detection: AI generation + fact-checking
    Multi-Format Support: Text, images, videos
    OCR & Captioning: Extract text and understand images
    Free APIs: No payment required
    Email Verification: Redis OTP system
    JWT Authentication: Secure token-based auth
    Detection History: Track all analyses
    Confidence Scoring: Transparency in results

API Keys Setup
Hugging Face (Free)

    Visit https://huggingface.co/
    Sign up → Settings → Access Tokens
    Create token → Copy to .env

Gmail App Password (Free)

    Google Account → Security
    Enable 2-Step Verification
    App Passwords → Generate
    Copy 16-char password to .env

Testing
bash

# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"pass123"}'

# Detect text
curl -X POST http://localhost:5000/api/detect/text \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text":"AI will revolutionize the world."}'

Troubleshooting

MongoDB Connection Error
bash

# Start MongoDB
mongod
# Or use MongoDB Atlas cloud

Redis Connection Error
bash

# Start Redis
redis-server
# Test: redis-cli ping (should return PONG)

FFmpeg Not Found
bash

# Install FFmpeg
brew install ffmpeg  # macOS
sudo apt-get install ffmpeg  # Linux

License

MIT License
Contact

Author: Yash Tiwari
Email: yshhh173@gmail.com
GitHub: @yshhh17
Roadmap

    React frontend
    Speech-to-text for videos
    Batch detection
    PDF reports
    Chrome extension
    Premium tiers

Built with ❤️ to combat misinformation