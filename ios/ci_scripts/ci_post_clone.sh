#!/bin/sh

# Xcode Cloud가 저장소를 클론한 후 실행되는 스크립트
# CocoaPods 의존성을 설치합니다

set -e

echo "🔧 Starting ci_post_clone.sh"
echo "📍 Current directory: $(pwd)"

# 프로젝트 루트로 이동 (스크립트가 ios/ci_scripts에서 실행되므로 두 단계 위로)
cd ../..
echo "📍 Moved to project root: $(pwd)"

# Node modules 설치 (필요한 경우)
if [ -f "package.json" ]; then
    echo "📦 Installing npm dependencies..."
    npm install --legacy-peer-deps || echo "⚠️ npm install failed, continuing..."
fi

# CocoaPods 설치
echo "📦 Installing CocoaPods dependencies..."
cd ios
pod install

echo "✅ Dependencies installed successfully!"
