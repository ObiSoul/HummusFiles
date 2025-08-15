#!/bin/bash

# Script to package the game for itch.io upload

echo "🎮 Packaging Hummus Where The Heart Is for itch.io..."

# Create package directory
mkdir -p itch-io-package

# Copy built game files
echo "📁 Copying game files..."
cp -r dist/* itch-io-package/

# Copy additional files
echo "📄 Adding documentation..."
cp ITCH_IO_UPLOAD_GUIDE.md itch-io-package/
cp README.md itch-io-package/ 2>/dev/null || echo "No README.md found, skipping..."

# Create the upload ZIP
echo "📦 Creating upload package..."
cd itch-io-package
zip -r ../hummus-where-the-heart-is-itch.zip ./*
cd ..

echo "✅ Package created: hummus-where-the-heart-is-itch.zip"
echo ""
echo "🚀 Next steps:"
echo "1. Upload hummus-where-the-heart-is-itch.zip to itch.io"
echo "2. Set platform to HTML/Web"
echo "3. Enable 'This file will be played in the browser'"
echo "4. Set embed size to 1200x800px"
echo "5. Add screenshots and description from ITCH_IO_UPLOAD_GUIDE.md"
echo ""
echo "🎉 Good luck with your itch.io launch!"
