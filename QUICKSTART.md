# Quick Start Guide - SAT Math Solver Web App

## 🚀 Chạy Local (Development)

**⚠️ QUAN TRỌNG: Phải chạy Backend TRƯỚC Frontend!**

### Bước 1: Setup Backend (Python) - CHẠY TRƯỚC ⚠️

```bash
# Vào folder backend
cd backend

# Cài dependencies
pip install -r requirements.txt

# Cấu hình (optional - có thể dùng mock)
cp .env.example .env
# Sửa .env nếu muốn dùng LLM thật

# Chạy backend (GIỮ TERMINAL NÀY CHẠY)
uvicorn main:app --reload --port 8000
```

**Kiểm tra backend đã chạy:**
- Mở http://localhost:8000 → Phải thấy `{"message": "SAT Math Solver API", "status": "running"}`
- Hoặc: `curl http://localhost:8000/health`

### Bước 2: Setup Frontend (Next.js) - MỞ TERMINAL MỚI

```bash
# Về root folder
cd ..

# Cài dependencies (nếu chưa)
npm install

# Chạy dev server
npm run dev
```

Frontend chạy tại: http://localhost:3000

### Bước 3: Test

1. Mở http://localhost:3000
2. Nhập bài toán, ví dụ: `If 2x + 5 = 15, what is x?`
3. Click "Solve Problem"
4. Xem solution với Desmos!

## 📦 Deploy Lên Vercel (3 Bước Đơn Giản)

### Bước 1: Deploy Backend (Python)

**Option A: Railway (Khuyến nghị)**

1. Push backend code lên GitHub (có thể tạo repo riêng hoặc subfolder)
2. Vào https://railway.app → New Project → Deploy from GitHub
3. Chọn repo/folder backend
4. Set environment variables (LLM_PROVIDER, API keys, etc.)
5. Railway tự động deploy → Lấy URL (ví dụ: `https://your-backend.railway.app`)

**Option B: Render**

1. Vào https://render.com → New Web Service
2. Connect GitHub → Chọn backend folder
3. Build: `pip install -r requirements.txt`
4. Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Set environment variables

### Bước 2: Deploy Frontend (Next.js)

1. **Push code lên GitHub**:
```bash
cd zim-sat-math-web
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/zim-sat-math-web.git
git push -u origin main
```

2. **Vào https://vercel.com** → Đăng nhập bằng GitHub

3. **Import repository** → Chọn repo → Click Deploy

4. **Set Environment Variable**:
   - Vào Settings → Environment Variables
   - Thêm: `BACKEND_URL` = URL của backend (từ Railway/Render)

5. **Redeploy** để apply environment variables

### Bước 3: Xong!

- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.railway.app`
- Mỗi lần push code mới → Tự động deploy lại

## 🎯 Cấu Hình LLM

### Sử dụng Mock (Testing - Không Cần API Key)

```bash
# backend/.env
LLM_PROVIDER=mock
```

### Sử dụng OpenAI

```bash
# backend/.env
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4-turbo-preview
```

Cài thêm:
```bash
pip install openai
```

### Sử dụng LiteLLM (Nhiều Providers)

```bash
# backend/.env
LLM_PROVIDER=litellm
LITELLM_MODEL=anthropic/claude-3-opus
ANTHROPIC_API_KEY=your-key
```

Cài thêm:
```bash
pip install litellm
```

## 🔧 Troubleshooting

### Lỗi: Backend không kết nối được

**Kiểm tra:**
```bash
# Test backend
curl http://localhost:8000/health

# Nếu không chạy, start lại:
cd backend
uvicorn main:app --reload --port 8000
```

**Frontend sẽ fallback về mock nếu backend không available (chỉ trong development)**

### Lỗi: npm install failed
- Đảm bảo Node.js version >= 18
- Xóa `node_modules` và `package-lock.json`, chạy lại `npm install`

### Lỗi: Build failed trên Vercel
- Xem logs trên Vercel Dashboard → Deployments → Build Logs
- Kiểm tra `package.json` có đúng không
- Đảm bảo `BACKEND_URL` được set trong Environment Variables

### Desmos không hiển thị
- Desmos load từ CDN, cần internet
- Kiểm tra browser console có lỗi không

## 📚 Tài Liệu Thêm

- **Chi tiết về Vercel**: Xem `DEPLOY.md`
- **Backend setup**: Xem `backend/README.md`
- **LLM Integration**: Xem `backend/README.md` và `INTEGRATION.md`
- **Cấu trúc code**: Xem `README.md`

## 💡 Tips

- ✅ Vercel miễn phí cho personal projects
- ✅ Railway có free tier cho backend
- ✅ Tự động HTTPS, không cần config
- ✅ Mỗi commit mới → tự động deploy preview
- ✅ Có thể custom domain nếu muốn

---

**Happy Coding! 🎉**
