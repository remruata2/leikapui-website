#!/bin/bash

echo "🔄 Pulling latest changes from git..."

# Pull latest changes
git pull origin main

# Check if pull was successful
if [ $? -eq 0 ]; then
    echo "✅ Successfully pulled changes!"
    echo "🛠️ Running build..."
    
    # Run npm build
    npm run build
    
    if [ $? -eq 0 ]; then
        echo "✅ Build completed successfully!"
    else
        echo "❌ Build failed!"
        exit 1
    fi
else
    echo "❌ Git pull failed!"
    exit 1
fi
