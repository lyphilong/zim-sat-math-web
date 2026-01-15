# Quick Guide: Deploy 2 Project Riêng Biệt

## 🚀 Cách Nhanh Nhất (2 Project, 1 Repo)

### Bước 1: Deploy Backend Project

1. Vào https://vercel.com → **Add New Project**
2. Import repo `zim-sat-math-web`
3. **Project Name**: `zim-sat-math-backend` (hoặc tên bạn muốn)
4. **Framework Preset**: Chọn **Other** (không phải Next.js) ⚠️ **QUAN TRỌNG**
5. **Root Directory**: Sửa thành `api` (không phải `app/api`) ⚠️ **QUAN TRỌNG**
6. **Build Command**: Xóa `npm run build`, để **trống**
7. **Output Directory**: Xóa `public`, để **trống**
8. **Install Command**: Sửa từ `npm install` thành `pip install -r requirements.txt` ⚠️ **QUAN TRỌNG**
9. Click **Deploy**

**⚠️ Lưu ý**: Vercel có thể auto-detect Next.js và set các giá trị mặc định. Bạn **phải sửa thủ công**:
- Root Directory: `api` (không có `app/` ở đầu)
- Install Command: `pip install -r requirements.txt` (không phải `npm install`)

**Lưu ý**: Backend sẽ có URL như: `https://zim-sat-math-backend.vercel.app`

### Bước 2: Set Environment Variables cho Backend

1. Vào Backend Project → **Settings** → **Environment Variables**
2. Thêm:
   - `LLM_PROVIDER` = `litellm` (hoặc `mock` để test)
   - `LITELLM_MODEL` = `gpt-4`
   - `OPENAI_API_KEY` = `sk-...`
3. Click **Save**
4. **Redeploy** backend

### Bước 3: Deploy Frontend Project

1. Vào Vercel → **Add New Project** (project mới)
2. Import **cùng repo** `zim-sat-math-web`
3. **Project Name**: `zim-sat-math-web` (hoặc tên bạn muốn)
4. **Root Directory**: `./` (root của repo)
5. **Framework Preset**: **Next.js** (auto-detect)
6. Click **Deploy**

### Bước 4: Set Environment Variables cho Frontend

1. Vào Frontend Project → **Settings** → **Environment Variables**
2. Thêm:
   - `BACKEND_URL` = `https://zim-sat-math-backend.vercel.app` ⚠️ **QUAN TRỌNG**
   - (Thay bằng URL backend project của bạn)
3. Click **Save**
4. **Redeploy** frontend

### Bước 5: Test

1. Mở Frontend URL: `https://zim-sat-math-web.vercel.app`
2. Nhập bài toán và test
3. Kiểm tra kết nối với backend

---

## ✅ Checklist

- [ ] Backend project đã deploy thành công
- [ ] Backend environment variables đã set (LLM_PROVIDER, API keys)
- [ ] Frontend project đã deploy thành công
- [ ] Frontend environment variable `BACKEND_URL` đã set
- [ ] Test frontend → backend connection thành công

---

## 📝 Lưu Ý

1. **Root Directory**: 
   - Backend: `./api`
   - Frontend: `./`

2. **Environment Variables**:
   - Backend: LLM config (LLM_PROVIDER, API keys)
   - Frontend: BACKEND_URL (URL của backend project)

3. **URLs**:
   - Backend: `https://backend-project.vercel.app`
   - Frontend: `https://frontend-project.vercel.app`
   - Frontend gọi Backend qua `BACKEND_URL`

---

## 🔧 Troubleshooting

### Frontend không kết nối được Backend

1. Kiểm tra `BACKEND_URL` trong Frontend env vars
2. Test backend trực tiếp: `curl https://backend-url.vercel.app/health`
3. Kiểm tra CORS headers (đã config sẵn trong `api/vercel.json`)

### Backend deploy failed

1. Kiểm tra Root Directory = `./api`
2. Kiểm tra `api/requirements.txt` có tồn tại
3. Xem build logs trên Vercel

---

**Xong! Bây giờ bạn có 2 project riêng biệt trên Vercel! 🎉**

