#!/bin/bash
# Script để push code với Personal Access Token

echo "🚀 Push code lên GitHub với account lyphilong"
echo ""
echo "Bước 1: Tạo Personal Access Token (nếu chưa có)"
echo "   → Vào: https://github.com/settings/tokens"
echo "   → Generate new token (classic)"
echo "   → Chọn quyền: repo (full control)"
echo "   → Copy token"
echo ""
read -p "Bạn đã có PAT chưa? (y/n): " has_pat

if [ "$has_pat" != "y" ]; then
    echo ""
    echo "Vui lòng tạo PAT trước: https://github.com/settings/tokens"
    exit 1
fi

echo ""
echo "Bước 2: Push code"
echo "Khi được hỏi:"
echo "  Username: lyphilong"
echo "  Password: (dán PAT của bạn)"
echo ""

git push -u origin main

