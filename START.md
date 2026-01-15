# 🚀 Hướng Dẫn Chạy App

## Thứ Tự Chạy (Quan Trọng!)

### Bước 1: Chạy Backend TRƯỚC ⚠️

```bash
cd backend

# Cài dependencies (nếu chưa)
pip install -r requirements.txt

# Chạy backend
uvicorn main:app --reload --port 8000
```

**Kiểm tra backend đã chạy:**
- Mở browser: http://localhost:8000
- Hoặc: `curl http://localhost:8000/health`
- Phải thấy: `{"status": "healthy"}`

### Bước 2: Chạy Frontend

**Mở terminal MỚI** (giữ backend đang chạy):

```bash
# Về root folder
cd ..

# Chạy frontend
npm run dev
```

**Kiểm tra frontend:**
- Mở browser: http://localhost:3000
- Nhập bài toán → Click "Solve Problem"
- Phải thấy solution hiển thị!

## ⚡ Chạy Cả 2 Cùng Lúc (Dễ Hơn)

```bash
# Từ root folder
./start-dev.sh
```

Script này sẽ tự động:
1. Chạy backend ở port 8000
2. Chạy frontend ở port 3000
3. Cả 2 chạy song song

**Dừng:** Nhấn `Ctrl+C` một lần để dừng cả 2.

## 🔍 Troubleshooting

### Backend không chạy được?

**Lỗi: ModuleNotFoundError**
```bash
cd backend
pip install -r requirements.txt
```

**Lỗi: Port 8000 đã được dùng**
```bash
# Tìm process đang dùng port 8000
lsof -i :8000

# Hoặc đổi port
uvicorn main:app --reload --port 8001
# Nhớ sửa BACKEND_URL trong frontend .env.local
```

**Lỗi: Import schemas**
- Đảm bảo file `backend/services/schemas.py` tồn tại
- Hoặc sửa import path trong `main.py`

### Frontend không kết nối được backend?

**Kiểm tra:**
1. Backend đang chạy ở http://localhost:8000?
2. Test: `curl http://localhost:8000/health`
3. Xem browser console có lỗi CORS không

**Nếu backend chưa chạy:**
- Frontend sẽ fallback về mock data (chỉ trong dev mode)
- Vẫn test được UI nhưng không có solution thật từ LLM

### LLM không hoạt động?

**Kiểm tra `.env` trong backend folder:**
```bash
cd backend
cat .env
```

**Nếu chưa có `.env`:**
```bash
cp .env.example .env
# Sửa .env để set LLM_PROVIDER và API keys
```

**Mock mode (không cần API key):**
```bash
# backend/.env
LLM_PROVIDER=mock
```

## 📝 Checklist Trước Khi Chạy

- [ ] Backend dependencies đã cài (`pip install -r requirements.txt`)
- [ ] Frontend dependencies đã cài (`npm install`)
- [ ] Backend đang chạy ở port 8000
- [ ] Frontend đang chạy ở port 3000
- [ ] Backend `.env` đã config (hoặc dùng mock mode)

## 🎯 Test Nhanh

```bash
# Terminal 1: Backend
cd backend && uvicorn main:app --reload --port 8000

# Terminal 2: Frontend  
cd .. && npm run dev

# Terminal 3: Test API
curl -X POST http://localhost:8000/solve \
  -H "Content-Type: application/json" \
  -d '{"problem": "If 2x + 5 = 15, what is x?"}'
```

Nếu thấy JSON response → Backend OK! ✅

