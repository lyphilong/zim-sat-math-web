# Hướng Dẫn Deploy Backend và Frontend Thành 2 Project Riêng

## Tổng Quan

Bạn có thể deploy backend và frontend thành **2 project riêng biệt** trên Vercel:
- **Frontend Project**: Next.js app
- **Backend Project**: Python FastAPI serverless functions

## Cách 1: 2 Project Trong Cùng Repo (Khuyến Nghị) ✅

### Cấu Trúc

```
zim-sat-math-web/                    # Một repo
├── app/                             # Frontend code
├── components/
├── package.json
├── vercel.json                      # Frontend config
│
└── api/                             # Backend code
    ├── solve.py
    ├── health.py
    ├── backend/
    ├── requirements.txt             # Backend dependencies
    └── vercel.json                  # Backend config
```

### Bước 1: Tạo vercel.json cho Backend

Tạo file `api/vercel.json`:

```json
{
  "functions": {
    "*.py": {
      "runtime": "python3.9"
    }
  },
  "rewrites": [
    {
      "source": "/solve",
      "destination": "/solve.py"
    },
    {
      "source": "/health",
      "destination": "/health.py"
    }
  ]
}
```

### Bước 2: Tạo requirements.txt cho Backend

Đảm bảo có `api/requirements.txt` (hoặc copy từ root):

```bash
cp requirements.txt api/requirements.txt
```

### Bước 3: Deploy Frontend Project

1. Vào Vercel Dashboard → **Add New Project**
2. Import repo `zim-sat-math-web`
3. **Root Directory**: `./` (root của repo)
4. Framework: **Next.js** (auto-detect)
5. Click **Deploy**

Frontend sẽ deploy tại: `https://frontend-app.vercel.app`

### Bước 4: Deploy Backend Project

1. Vào Vercel Dashboard → **Add New Project** (project mới)
2. Import **cùng repo** `zim-sat-math-web`
3. **Root Directory**: `./api` ⚠️ **QUAN TRỌNG**
4. Framework: **Other** (không phải Next.js)
5. Build Command: (để trống hoặc `echo "No build needed"`)
6. Output Directory: (để trống)
7. Install Command: `pip install -r requirements.txt`
8. Click **Deploy**

Backend sẽ deploy tại: `https://backend-app.vercel.app`

### Bước 5: Cấu Hình Frontend Gọi Backend

1. Vào Frontend Project → **Settings** → **Environment Variables**
2. Thêm:
   - `BACKEND_URL` = `https://backend-app.vercel.app`
3. **Redeploy** frontend

### Bước 6: Cấu Hình CORS cho Backend

Backend đã có CORS middleware cho phép tất cả origins, nên không cần config thêm.

---

## Cách 2: 2 Repo Riêng Biệt

### Bước 1: Tạo Backend Repo Mới

```bash
# Tạo folder mới cho backend
mkdir zim-sat-math-backend
cd zim-sat-math-backend

# Copy backend code
cp -r ../zim-sat-math-web/api/* .
cp ../zim-sat-math-web/requirements.txt .

# Init git
git init
git add .
git commit -m "Initial commit: SAT Math Solver Backend"

# Tạo repo trên GitHub/GitLab
# Sau đó push:
git remote add origin https://github.com/your-username/zim-sat-math-backend.git
git push -u origin main
```

### Bước 2: Cấu Trúc Backend Repo

```
zim-sat-math-backend/
├── solve.py
├── health.py
├── backend/
│   └── services/
├── requirements.txt
└── vercel.json
```

### Bước 3: Deploy Backend Repo

1. Vào Vercel → **Add New Project**
2. Import repo `zim-sat-math-backend`
3. Framework: **Other**
4. Build Command: (để trống)
5. Install Command: `pip install -r requirements.txt`
6. Click **Deploy**

Backend URL: `https://backend-app.vercel.app`

### Bước 4: Deploy Frontend Repo

1. Vào Frontend Project → **Settings** → **Environment Variables**
2. Thêm: `BACKEND_URL` = `https://backend-app.vercel.app`
3. **Redeploy**

---

## So Sánh 2 Cách

| Tiêu chí | Cách 1 (Cùng Repo) | Cách 2 (2 Repo) |
|----------|-------------------|-----------------|
| Số repo | 1 repo | 2 repo |
| Quản lý code | Dễ (cùng chỗ) | Phức tạp hơn (2 chỗ) |
| Deploy | 2 project, 1 repo | 2 project, 2 repo |
| Sync code | Tự động | Cần sync thủ công |
| **Khuyến nghị** | ✅ **Nên dùng** | Khi cần tách hoàn toàn |

---

## Cấu Hình Chi Tiết

### Backend vercel.json (api/vercel.json)

```json
{
  "functions": {
    "*.py": {
      "runtime": "python3.9"
    }
  },
  "rewrites": [
    {
      "source": "/solve",
      "destination": "/solve.py"
    },
    {
      "source": "/health",
      "destination": "/health.py"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type"
        }
      ]
    }
  ]
}
```

### Frontend vercel.json (root/vercel.json)

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["sin1"]
}
```

**Lưu ý**: Xóa phần `functions` vì backend đã tách riêng.

---

## Environment Variables

### Backend Project

Set trên Backend Project → Settings → Environment Variables:

- `LLM_PROVIDER` = `litellm` hoặc `mock`
- `LITELLM_MODEL` = `gpt-4`
- `OPENAI_API_KEY` = `sk-...`

### Frontend Project

Set trên Frontend Project → Settings → Environment Variables:

- `BACKEND_URL` = `https://backend-app.vercel.app` ⚠️ **QUAN TRỌNG**

---

## Test Sau Khi Deploy

### 1. Test Backend

```bash
# Health check
curl https://backend-app.vercel.app/health

# Solve endpoint
curl -X POST https://backend-app.vercel.app/solve \
  -H "Content-Type: application/json" \
  -d '{"problem": "If 2x + 5 = 15, what is x?"}'
```

### 2. Test Frontend

1. Mở `https://frontend-app.vercel.app`
2. Nhập bài toán
3. Kiểm tra kết nối với backend

---

## Troubleshooting

### Backend không accessible từ Frontend

**Nguyên nhân**: CORS hoặc BACKEND_URL chưa set đúng

**Giải pháp**:
1. Kiểm tra `BACKEND_URL` trong Frontend env vars
2. Kiểm tra CORS headers trong backend
3. Test backend trực tiếp bằng curl

### Backend deploy failed

**Nguyên nhân**: Root Directory chưa set đúng

**Giải pháp**:
- Đảm bảo Root Directory = `./api` (nếu dùng Cách 1)
- Hoặc root của backend repo (nếu dùng Cách 2)

---

## Khuyến Nghị

**Nên dùng Cách 1** (2 project, 1 repo) vì:
- ✅ Dễ quản lý code
- ✅ Không cần tạo repo mới
- ✅ Code sync tự động
- ✅ Dễ maintain

**Chỉ dùng Cách 2** (2 repo) khi:
- Cần tách hoàn toàn backend và frontend
- Có team riêng maintain backend
- Cần deploy độc lập hoàn toàn

