#!/bin/bash
export $(grep -v '^#' .env.local | xargs)

echo "🐳 Building FridgeChef Docker image..."
docker build -t fridgechef:v1 .

if [ $? -ne 0 ]; then
  echo "❌ Build failed!"
  exit 1
fi

echo "✅ Build successful!"
echo "🚀 Running FridgeChef container..."

docker run -p 3000:3000 \
  -e MONGODB_URI="${MONGODB_URI}" \
  -e NEXTAUTH_SECRET="${NEXTAUTH_SECRET}" \
  -e NEXTAUTH_URL="${NEXTAUTH_URL}" \
  -e GEMINI_API_KEY="${GEMINI_API_KEY}" \
  fridgechef:v1
