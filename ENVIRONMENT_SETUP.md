# Environment Setup Guide

## Overview

This project supports both local development and production deployment with PostHog integration via Lambda/API Gateway.

## Environment Variables

### Required Variables

Create a `.env` file in your project root with these variables:

```bash
# PostHog Configuration
VITE_MOCK_MODE=false
VITE_API_BASE_URL=https://rnmhuyxd2k.execute-api.us-west-1.amazonaws.com/prod/posthog-query

# PostHog API Keys (set these in your Lambda environment variables)
# POSTHOG_PROJECT_ID=your_posthog_project_id
# POSTHOG_PERSONAL_API_KEY=your_posthog_personal_api_key
# POSTHOG_HOST=https://app.posthog.com

# Supabase Configuration (already configured in code)
VITE_SUPABASE_URL=https://weahzmsmhxextohossfp.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlYWh6bXNtaHhleHRvaG9zc2ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NjM4NDAsImV4cCI6MjA3MjEzOTg0MH0.Ack4J88Wfx3QniM1YMyIaIvFZ5P1_XTWC-bovwdYJm8
```

## Setup Options

### Option 1: Production Setup (Recommended)

**Use Lambda/API Gateway - No local server needed**

1. **Set your API Gateway URL** in `.env`:

   ```bash
   VITE_API_BASE_URL=https://rnmhuyxd2k.execute-api.us-west-1.amazonaws.com/prod/posthog-query
   ```

2. **Run locally with live data**:

   ```bash
   npm run dev:live
   ```

3. **Deploy to S3**:
   ```bash
   npm run deploy
   ```

### Option 2: Local Development Setup

**Use local PostHog proxy server**

1. **Set local server URL** in `.env`:

   ```bash
   VITE_API_BASE_URL=http://localhost:8787/api/posthog-query
   ```

2. **Start local PostHog proxy**:

   ```bash
   npm run posthog:dev
   ```

3. **In another terminal, start the app**:
   ```bash
   npm run dev:local
   ```

### Option 3: Mock Data Setup

**Use mock data for development**

1. **Set mock mode** in `.env`:

   ```bash
   VITE_MOCK_MODE=true
   ```

2. **Run with mock data**:
   ```bash
   npm run dev:mock
   ```

## Lambda Function Setup

Your `lambda-function.js` is already configured to handle PostHog queries. Make sure:

1. **Lambda function** is deployed to AWS
2. **API Gateway** is configured to route to your Lambda
3. **Environment variables** are set in Lambda:
   - `POSTHOG_PROJECT_ID`
   - `POSTHOG_PERSONAL_API_KEY`
   - `POSTHOG_HOST`

## Deployment Commands

```bash
# Deploy with live PostHog data
npm run deploy

# Deploy with production profile
npm run deploy:prod
```

## Troubleshooting

### Dashboard not showing data?

1. Check if `VITE_MOCK_MODE=false` in your `.env`
2. Verify your API Gateway URL is correct
3. Check browser console for API errors
4. Ensure Lambda function has correct PostHog credentials

### Range dropdown not working?

- The range functionality is now fixed and should work with live data
- All API calls now properly use the selected date range

### Local development issues?

- Use `npm run dev:local` for local PostHog proxy
- Use `npm run dev:live` for Lambda/API Gateway
- Use `npm run dev:mock` for mock data
