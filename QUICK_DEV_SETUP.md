# 🚀 Quick Development Setup

## Step 1: Start the Server
```bash
cd server
npm run dev
```

## Step 2: Create Development Users

Once the server is running, open a new terminal and use these commands:

### Create User Account
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@test.com",
    "password": "user123",
    "name": "Test User"
  }'
```

### Create Therapist Account  
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "therapist@test.com", 
    "password": "therapist123",
    "name": "Dr. Test Therapist"
  }'
```

### Create Astrologer Account
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "astrologer@test.com",
    "password": "astrologer123", 
    "name": "Test Astrologer"
  }'
```

### Create Admin Account
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "admin123",
    "name": "Test Admin"
  }'
```

## Step 3: Login and Get Tokens

### User Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@test.com",
    "password": "user123"
  }'
```

### Therapist Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "therapist@test.com",
    "password": "therapist123"
  }'
```

## Step 4: Use Dev Login Endpoints (Easier!)

After creating the accounts, you can use the quick dev login:

```bash
# Get user token
curl http://localhost:3000/api/v1/dev-login/user@test.com

# Get therapist token  
curl http://localhost:3000/api/v1/dev-login/therapist@test.com

# Get astrologer token
curl http://localhost:3000/api/v1/dev-login/astrologer@test.com

# Get admin token
curl http://localhost:3000/api/v1/dev-login/admin@test.com
```

## 📱 Development Credentials

| Role | Email | Password | Dashboard Access |
|------|-------|----------|------------------|
| 👤 User | user@test.com | user123 | Full therapy experience |
| 👨‍⚕️ Therapist | therapist@test.com | therapist123 | Session management |
| 🔮 Astrologer | astrologer@test.com | astrologer123 | Consultations |
| 👑 Admin | admin@test.com | admin123 | Platform management |

## 🎯 Quick Access URLs

After server starts, visit these URLs in browser:
- http://localhost:3000/api/v1/dev-login/user@test.com
- http://localhost:3000/api/v1/dev-login/therapist@test.com  
- http://localhost:3000/api/v1/dev-login/astrologer@test.com
- http://localhost:3000/api/v1/dev-login/admin@test.com

## 💡 Pro Tips

1. **Use different browser tabs** for each role to stay logged in simultaneously
2. **Save the tokens** from login responses for API testing
3. **Use Postman** to save these requests for quick access
4. **Check the server logs** to see user creation and login events

## 🔧 If Something Goes Wrong

1. Make sure PostgreSQL is running on localhost:5432
2. Check that the .env file has the correct DATABASE_URL
3. Verify the server starts without errors
4. Clear browser cookies if login seems stuck

Now you can easily switch between all dashboard views! 🚀
