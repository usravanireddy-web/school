# School Management System API - Vercel Deployment

This API is configured for deployment on Vercel with MySQL Atlas.

## Quick Deploy to Vercel

### Option 1: Deploy with Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts
# When asked for environment variables, set:
# - MYSQL_HOST
# - MYSQL_USER  
# - MYSQL_PASSWORD
# - MYSQL_DATABASE
# - MYSQL_PORT=3306
# - MYSQL_SSL=true