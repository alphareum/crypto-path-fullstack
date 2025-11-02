#!/bin/bash
# Railway prebuild hook - runs before Railpack build phase
# Creates .env from .env.example for artisan commands during build
# Railway's actual environment variables override these at runtime

echo "🔧 Railway prebuild hook: Creating .env from .env.example for build phase"

if [ -f .env.example ]; then
    cp .env.example .env
    echo "✅ .env created from .env.example"
else
    echo "⚠️  Warning: .env.example not found"
    exit 1
fi

echo "📝 .env file ready for artisan commands during build"
