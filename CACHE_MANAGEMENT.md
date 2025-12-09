# Cache Management

This project includes cache management scripts to help resolve build issues and ensure clean deployments.

## Quick Start

### Clear Cache (Windows PowerShell)
```bash
npm run clear-cache
# or
npm run clean
```

### Clear Cache (Linux/Mac)
```bash
chmod +x clear-cache.sh
./clear-cache.sh
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run clear-cache` | Clears all Next.js and build caches |
| `npm run clean` | Alias for clear-cache |
| `npm run fresh-build` | Clears cache and runs production build |
| `npm run fresh-dev` | Clears cache and starts dev server |

## What Gets Cleared?

The cache clearing scripts remove:

1. **`.next/`** - Next.js build output and cache
2. **`node_modules/.cache/`** - Node modules cache
3. **`.turbo/`** - Turbopack cache (if using Turbopack)
4. **`tsconfig.tsbuildinfo`** - TypeScript incremental build info

## When to Clear Cache?

Clear cache when you experience:

- ✗ Build errors that persist after code fixes
- ✗ Type errors that don't match your actual code
- ✗ Stale imports or module resolution issues
- ✗ Deployment failures on Vercel/other platforms
- ✗ Hot reload not working properly in development

## Manual Cache Clearing

### Windows PowerShell
```powershell
# Run the PowerShell script directly
.\clear-cache.ps1
```

### Linux/Mac/Git Bash
```bash
# Run the bash script directly
./clear-cache.sh
```

## Vercel Deployments

Vercel automatically caches builds. If you need to bypass Vercel's cache:

1. Go to your Vercel project dashboard
2. Navigate to Settings → General
3. Scroll to "Build & Development Settings"
4. Click "Bypass build cache" for the next deployment

Or add this to your `vercel.json`:
```json
{
  "buildCommand": "npm run fresh-build"
}
```

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Clear cache before build
  run: |
    chmod +x clear-cache.sh
    ./clear-cache.sh

- name: Build application
  run: npm run build
```

## Troubleshooting

### Script won't run on Windows?
```powershell
# Set execution policy (run as Administrator)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Script won't run on Linux/Mac?
```bash
# Make script executable
chmod +x clear-cache.sh
```

### Still having issues after clearing cache?

1. **Restart your development server**
   ```bash
   # Stop current dev server (Ctrl+C)
   npm run fresh-dev
   ```

2. **Reinstall dependencies**
   ```bash
   npm run clear-cache
   rm -rf node_modules
   npm install
   ```

3. **Check for TypeScript errors**
   ```bash
   npx tsc --noEmit
   ```

## Best Practices

- 🔄 Clear cache before important deployments
- 🧪 Clear cache when switching between major branches
- 📦 Clear cache after updating major dependencies
- 🐛 Clear cache as first troubleshooting step for build issues

## Notes

- Cache clearing is safe and won't delete any source code
- Build times may be slightly longer after clearing cache (first build only)
- Development server will need to restart after cache clearing
- These scripts are safe to run multiple times

## Support

If you continue to experience issues after clearing cache:
1. Check the error logs carefully
2. Verify all dependencies are installed: `npm install`
3. Check Node.js version matches requirements: `node --version`
4. Review recent code changes that might have introduced issues
