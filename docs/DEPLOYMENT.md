# Deployment Guide

## Local Development
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Copy `.env.example` to `.env.local` and add your Sanity project ID and dataset.
4. Run the development server:
   ```bash
   npm run dev
   ```

## Pushing to GitHub
1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Commit your changes:
   ```bash
   git add .
   git commit -m "Description of changes"
   ```
3. Push to GitHub:
   ```bash
   git push origin feature/your-feature-name
   ```
4. Create a Pull Request on GitHub.

## Vercel Auto-deploy
The project is configured for auto-deployment on Vercel.
1. Any changes pushed to the `main` branch will trigger an automatic production deployment.
2. Pull Requests will trigger dynamic preview deployments for testing.
3. Ensure Vercel environment variables match your local `.env` settings.
