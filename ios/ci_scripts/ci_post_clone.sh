#!/bin/sh

# Xcode Cloud가 저장소를 클론한 후 실행되는 스크립트
# CocoaPods 의존성을 설치합니다

set -e

echo "🔧 Installing CocoaPods dependencies..."

# 프로젝트 루트로 이동
cd $CI_WORKSPACE

# Node modules 설치 (필요한 경우)
if [ -f "package.json" ]; then
    echo "📦 Installing npm dependencies..."
    npm ci
fi

# CocoaPods 설치
cd ios
echo "📦 Installing CocoaPods..."
pod install

echo "✅ Dependencies installed successfully!"
