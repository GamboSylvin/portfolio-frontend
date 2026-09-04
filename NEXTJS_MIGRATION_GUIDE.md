# Portfolio Next.js Fullstack Migration - Setup Guide

## ✅ Completed Changes

### 1. Added Dependencies
- ✅ Prisma ORM (@prisma/client, prisma CLI)
- ✅ JWT Authentication (jsonwebtoken, bcryptjs)
- ✅ Email Service (nodemailer)
- ✅ Request Validation (zod)

### 2. Database Schema (Prisma)
- ✅ User (admin authentication)
- ✅ Project
- ✅ BlogPost  
- ✅ ContactMessage
- ✅ Visitor

### 3. API Routes Created
**Public Routes:**
- ✅ `GET /api/health` - Health check
- ✅ `POST /api/auth/login` - Admin login
- ✅ `POST /api/visitors` - Track visitors
- ✅ `GET /api/blog` - List blog posts
- ✅ `GET /api/blog/[slug]` - Get single blog post
- ✅ `GET /api/projects` - List projects
- ✅ `GET /api/projects/[id]` - Get single project
- ✅ `POST /api/contact` - Submit contact form

**Admin Protected Routes:**
- ✅ `GET /api/admin/analytics` - Dashboard analytics
- ✅ `GET /api/admin/blog` - List blog posts
- ✅ `POST /api/admin/blog` - Create blog post
- ✅ `PUT /api/admin/blog/[id]` - Update blog post
- ✅ `DELETE /api/admin/blog/[id]` - Delete blog post
- ✅ `GET /api/admin/projects` - List projects
- ✅ `POST /api/admin/projects` - Create project
- ✅ `PUT /api/admin/projects/[id]` - Update project
- ✅ `DELETE /api/admin/projects/[id]` - Delete project
- ✅ `GET /api/admin/messages` - Get contact messages
- ✅ `DELETE /api/admin/messages/[id]` - Delete message

### 4. Utility Libraries
- ✅ Prisma client singleton (`lib/prisma.ts`)
- ✅ JWT token generation/verification (`lib/jwt.ts`)
- ✅ Email service (`lib/email.ts`)
- ✅ Auth middleware (`lib/auth-middleware.ts`)

---

## 🚀 Next Steps to Deploy

### Step 1: Install Dependencies
```bash
cd portfolio-frontend
npm install
```

### Step 2: Set Up PostgreSQL Database
You have two options:

**Option A: Local PostgreSQL**
1. Install PostgreSQL locally
2. Create a database: `createdb portfolio`
3. Update `.env.local` with connection string

**Option B: Cloud Database (Recommended for Vercel)**
- Use Vercel PostgreSQL, Railway, Neon, or Supabase
- Get the connection string and update `.env.local`

### Step 3: Run Database Migrations
```bash
# Create migration files
npx prisma migrate dev --name init

# This will:
# - Create the database schema
# - Generate Prisma client
```

### Step 4: Create Admin User
Run this script to create an admin user:

```bash
npx ts-node -e "
import { prisma } from './src/lib/prisma'
import bcryptjs from 'bcryptjs'

async function main() {
  const hashedPassword = await bcryptjs.hash('your-password-here', 10)
  const user = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword,
    },
  })
  console.log('Admin user created:', user)
}

main().catch(console.error).finally(() => process.exit(0))
"
```

Or manually create it by:
1. Creating a seed file: `prisma/seed.ts`
2. Running: `npx prisma db seed`

### Step 5: Update Environment Variables
Update `.env.local`:
```env
# Database (use your PostgreSQL connection string)
DATABASE_URL="postgresql://user:password@host:5432/portfolio"

# JWT Secret (change this!)
JWT_SECRET="your-super-secret-key"

# Email Configuration (for contact form)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
EMAIL_FROM="noreply@your-domain.com"

# API Base URL
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000/api"
```

### Step 6: Run Development Server
```bash
npm run dev
```

Test API routes:
- Health: http://localhost:3000/api/health
- Login: POST to http://localhost:3000/api/auth/login

### Step 7: Deploy to Vercel

1. Push code to GitHub
2. Connect repo to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

---

## 📝 Environment Variables for Vercel

Set these in Vercel project settings:

```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@your-domain.com
NEXT_PUBLIC_API_BASE_URL=https://your-domain.vercel.app/api
```

---

## 🔐 Email Configuration

### Option 1: Gmail (Recommended for Testing)
1. Enable 2FA on Gmail
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use app password in EMAIL_PASS

### Option 2: Use Resend (Vercel's Email Service)
Replace nodemailer with Resend for production:
```bash
npm install resend
```

---

## 📚 Important Notes

1. **The old Spring Boot backend (`portfolio-backend/`) is no longer needed** - all endpoints are now Next.js API routes

2. **Frontend API calls** already configured to use `/api/` relative paths (automatic on same domain)

3. **JWT Token Handling** - Token is auto-added to requests from `localStorage.auth_token`

4. **Serverless on Vercel** - No need for Java/Spring Boot, all API routes run as serverless functions

---

## 🧹 Cleanup

You can now remove:
- `portfolio-backend/` - Java Spring Boot (replaced by Next.js API routes)
- Consider keeping `admin-dashboard/` separate or migrate components if not using the same repo structure yet

---

## 📞 Troubleshooting

**Database connection failed?**
- Check DATABASE_URL format
- Ensure PostgreSQL is running
- Verify credentials

**Auth failing?**
- Ensure JWT_SECRET is set
- Check token is in localStorage
- Verify Authorization header format

**Email not sending?**
- Verify SMTP credentials
- Check EMAIL_USER has permission to send
- Review error logs

---

## Next: Merge Admin Dashboard

To fully complete the migration, you should:
1. Copy admin dashboard components from `admin-dashboard/src/app/` 
2. Paste to `portfolio-frontend/src/app/admin/`
3. Update API calls to use new routes
4. Test admin functionality

This will create a true unified fullstack application!
