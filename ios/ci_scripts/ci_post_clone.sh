#!/bin/sh

# Xcode Cloud가 저장소를 클론한 후 실행되는 스크립트
# CocoaPods 의존성을 설치합니다

set -e

echo "🔧 Starting ci_post_clone.sh"
echo "📍 Current directory: $(pwd)"

# 프로젝트 루트로 이동 (스크립트가 ios/ci_scripts에서 실행되므로 두 단계 위로)
cd ../..
echo "📍 Moved to project root: $(pwd)"

# Homebrew 경로 설정 (Apple Silicon과 Intel Mac 모두 지원)
if [ -f "/opt/homebrew/bin/brew" ]; then
    eval "$(/opt/homebrew/bin/brew shellenv)"
    echo "✅ Homebrew configured (Apple Silicon)"
elif [ -f "/usr/local/bin/brew" ]; then
    eval "$(/usr/local/bin/brew shellenv)"
    echo "✅ Homebrew configured (Intel)"
fi

# Node.js 설치 확인 및 설치
if ! command -v node &> /dev/null; then
    echo "📦 Node.js not found. Installing via Homebrew..."
    brew install node@18
    # Node.js PATH 추가
    export PATH="/opt/homebrew/opt/node@18/bin:$PATH"
    export PATH="/usr/local/opt/node@18/bin:$PATH"
else
    echo "✅ Node.js already installed: $(node --version)"
fi

# npm 경로 확인
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found even after Node.js installation"
    echo "📍 PATH: $PATH"
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Node modules 설치
if [ -f "package.json" ]; then
    echo "📦 Installing npm dependencies..."
    npm install --legacy-peer-deps
fi

# CocoaPods 설치
echo "📦 Installing CocoaPods dependencies..."
cd ios
pod install

echo "✅ Dependencies installed successfully!"
