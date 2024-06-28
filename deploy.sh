#!/bin/bash

# 로그 파일 설정
LOG_FILE="$HOME/deploy.log"
exec > >(tee -i $LOG_FILE)
exec 2>&1

# NVM 초기화
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
    source "$NVM_DIR/nvm.sh"
else
    echo "NVM is not installed. Installing NVM..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
    source "$NVM_DIR/nvm.sh"
fi

# Node.js 설치 확인 및 설치
if ! command -v node &> /dev/null
then
    echo "Node.js is not installed. Installing Node.js...."
    nvm install --lts
fi

# 디렉토리 확인 및 생성
if [ ! -d "/home/ubuntu/nest-template" ]; then
    echo "Creating directory /home/ubuntu/nest-template..."
    mkdir -p /home/ubuntu/nest-template || { echo "Failed to create directory"; exit 1; }
fi

# 서버로 이동
cd /home/ubuntu/nest-template || { echo "Directory does not exist"; exit 1; }

# Git 저장소 업데이트
echo "Pulling latest code from GitHub..."
git pull git@github.com:wlduq0150/nest-template.git main || { echo "Failed to pull code from GitHub"; exit 1; }

# 종속성 설치
echo "Installing dependencies..."
npm install || { echo "Failed to install dependencies"; exit 1; }

# 빌드
echo "Building the application..."
npm run build || { echo "Failed to build the application"; exit 1; }

# 애플리케이션 재시작
echo "Restarting the application with PM2..."
pm2 restart all || { echo "Failed to restart the application"; exit 1; }

echo "Deployment completed successfully."
