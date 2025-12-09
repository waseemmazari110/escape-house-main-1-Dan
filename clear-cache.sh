#!/bin/bash
# Clear Next.js and Node.js cache script
# This script removes all cache directories to ensure a clean build

echo "🧹 Clearing Next.js and Node.js cache..."

# Clear Next.js build cache
if [ -d ".next" ]; then
    echo "  ✓ Removing .next directory..."
    rm -rf .next
    echo "  ✓ .next directory removed"
else
    echo "  ℹ .next directory not found"
fi

# Clear node_modules cache
if [ -d "node_modules/.cache" ]; then
    echo "  ✓ Removing node_modules/.cache directory..."
    rm -rf node_modules/.cache
    echo "  ✓ node_modules/.cache directory removed"
else
    echo "  ℹ node_modules/.cache directory not found"
fi

# Clear Turbopack cache if exists
if [ -d ".turbo" ]; then
    echo "  ✓ Removing .turbo directory..."
    rm -rf .turbo
    echo "  ✓ .turbo directory removed"
fi

# Clear TypeScript build info
if [ -f "tsconfig.tsbuildinfo" ]; then
    echo "  ✓ Removing TypeScript build info..."
    rm -f tsconfig.tsbuildinfo
    echo "  ✓ TypeScript build info removed"
fi

echo ""
echo "✅ Cache cleared successfully!"
echo ""
echo "You can now run: npm run dev or npm run build"
