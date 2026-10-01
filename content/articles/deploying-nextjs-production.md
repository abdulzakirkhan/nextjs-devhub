# Deploying Next.js Applications to Production

## Introduction

Production deployment depends on the application's runtime requirements, environment configuration, build output, and operational controls. A repeatable pipeline should validate the production build and keep secrets outside source control.

Next.js 16 offers multiple deployment options—Vercel, Azure, Docker, and more. Each has its strengths, and choosing the right one depends on your requirements, budget, and team expertise.

This guide compares common deployment options and outlines checks to complete before exposing a Next.js application to traffic.

## Vercel Deployment

Vercel provides first-party Next.js deployment support. Other platforms can also work; choose based on runtime compatibility, operations, cost, and team requirements.

### Automatic Deployment

Connect your GitHub repository to Vercel:

1. Go to Vercel dashboard
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure build settings:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

Vercel automatically detects Next.js and configures everything.

### Environment Variables

Add environment variables in Vercel dashboard:

```env
DATABASE_URL=your-database-url
NEXT_PUBLIC_API_URL=your-api-url
```

### Custom Domains

Add a custom domain in Vercel dashboard:

1. Go to Settings > Domains
2. Add your domain
3. Update DNS records as instructed

Vercel handles SSL certificates automatically.

## Azure Deployment

For enterprise applications, Azure offers robust hosting options.

### Azure Static Web Apps

Perfect for static sites and serverless functions:

```bash
npm install -g @azure/static-web-apps-cli
swa deploy
```

Configure in `azure-static-web-apps.json`:

```json
{
  "configurations": {
    "production": {
      "appLocation": ".",
      "apiLocation": "api",
      "outputLocation": ".next",
      "appBuildCommand": "npm run build",
      "apiBuildCommand": "npm run build"
    }
  }
}
```

### Azure Container Apps

For containerized deployments:

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

Deploy to Azure Container Apps:

```bash
az containerapp create \
  --resource-group myResourceGroup \
  --name my-app \
  --image my-registry/my-app:latest \
  --target-port 3000
```

## Docker Deployment

Docker provides portability across different platforms.

### Dockerfile

Create a production-optimized Dockerfile:

```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

Update next.config.ts for standalone output:

```typescript
// next.config.ts
const nextConfig = {
  output: 'standalone',
};

export default nextConfig;
```

Build and run:

```bash
docker build -t my-nextjs-app .
docker run -p 3000:3000 my-nextjs-app
```

## CI/CD Pipelines

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### GitLab CI

Create `.gitlab-ci.yml`:

```yaml
deploy:
  stage: deploy
  only:
    - main
  script:
    - npm ci
    - npm run build
    - vercel --prod --token=$VERCEL_TOKEN
```

## Production Monitoring

### Vercel Analytics

Enable in Vercel dashboard:

1. Go to Analytics
2. Enable Web Vitals
3. Add the script to your app

### LogRocket

For session replay and error tracking:

```bash
npm install @logrocket/react
```

```typescript
// app/layout.tsx
import LogRocket from 'logrocket';

if (typeof window !== 'undefined') {
  LogRocket.init('your-app-id');
}
```

### Sentry

For error tracking:

```bash
npm install @sentry/nextjs
```

```typescript
// sentry.server.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

## Common Mistakes

### 1. Not Testing in Staging

Always deploy to a staging environment first. Test thoroughly before production.

### 2. Ignoring Build Errors

Don't ignore build warnings. They often indicate issues that will fail in production.

### 3. Not Setting Up Monitoring

You can't fix what you don't measure. Set up monitoring from day one.

### 4. Forgetting Environment Variables

Ensure all environment variables are set in production. Missing variables cause runtime errors.

### 5. Not Having Rollback Plan

Always have a rollback plan. If deployment fails, you need to revert quickly.

## Production Checklist

Before deploying to production:

✓ All tests passing
✓ Environment variables configured
✓ Database migrations run
✓ SSL certificates configured
✓ Monitoring set up
✓ Error tracking enabled
✓ CDN configured for static assets
✓ Rate limiting implemented
✓ Backup strategy in place
✓ Rollback plan documented

## FAQ

### What is the best platform for Next.js deployment?

Vercel is the official platform and offers the best integration, but you can also deploy to AWS, Azure, Docker, or other platforms.

### How do I set up CI/CD for Next.js?

Use GitHub Actions, GitLab CI, or similar tools to automatically test and deploy your Next.js application on push.

### What environment variables do I need?

Database URLs, API keys, authentication secrets, and any configuration specific to your application.

### How do I monitor production performance?

Use Vercel Analytics, LogRocket, Sentry, or similar tools to monitor performance, errors, and user behavior.

### Should I use Docker for Next.js?

Docker is useful for self-hosting or deploying to platforms without native Next.js support, but may add complexity.
