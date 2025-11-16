# FastTrack Deployment Guide

## Deploy to Vercel

### Option 1: Deploy via Vercel CLI (Recommended)

1. Install Vercel CLI globally:
```bash
npm install -g vercel
```

2. Login to your Vercel account:
```bash
vercel login
```

3. Deploy the project:
```bash
vercel
```

4. Follow the prompts:
   - Set up and deploy: Yes
   - Which scope: Select your account
   - Link to existing project: No
   - Project name: FastTrack (or your preferred name)
   - Directory: ./ (root)
   - Override settings: No

5. For production deployment:
```bash
vercel --prod
```

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub (already done!)

2. Go to [Vercel Dashboard](https://vercel.com/dashboard)

3. Click "Add New" → "Project"

4. Import your GitHub repository: `mubashirrao1122/FastTrack`

5. Configure project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

6. Click "Deploy"

### Environment Variables

No environment variables are required for basic deployment. If you add any in the future, add them in:
- Vercel Dashboard → Project Settings → Environment Variables

### Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### Build Settings

The project is pre-configured with:
- ✅ Optimized build with code splitting
- ✅ Minification and compression
- ✅ Console logs removed in production
- ✅ Asset caching headers
- ✅ SPA routing configuration

## Performance Optimizations

The following optimizations are already configured:

1. **Code Splitting**: Separates React, Three.js, and UI libraries into chunks
2. **Tree Shaking**: Removes unused code
3. **Minification**: Terser minification for smaller bundles
4. **Lazy Loading**: Components loaded on demand
5. **Asset Optimization**: Long-term caching for fonts and assets

## Post-Deployment

After deployment:

1. Test all features:
   - Dashboard 3D logo
   - Department management
   - Class creation
   - Student enrollment
   - Attendance marking

2. Check performance:
   - Run Lighthouse audit
   - Test on mobile devices
   - Verify loading times

3. Monitor:
   - Check Vercel Analytics
   - Review deployment logs
   - Set up error tracking (optional)

## Troubleshooting

### Build Fails
- Check Node.js version (18+)
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check build locally: `npm run build`

### 3D Logo Not Rendering
- Verify font file is in `public/fonts/`
- Check browser WebGL support
- Clear browser cache

### Routes Not Working
- Vercel.json is configured for SPA routing
- Check if vercel.json exists in root directory

### Slow Loading
- Enable Vercel's Edge Network
- Consider implementing lazy loading for heavy components
- Use Vercel Analytics to identify bottlenecks

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Production Build](https://vitejs.dev/guide/build.html)
- [React Performance](https://react.dev/learn/render-and-commit)
