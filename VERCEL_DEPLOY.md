# Hướng Dẫn Deploy Front-end Lên Vercel

## Tổng Quan

Project này có:
- **Front-end**: Next.js 14 (TypeScript) - Deploy trên Vercel
- **Backend**: Python FastAPI - Deploy trên server công ty (bạn sẽ map domain)

## Bước 1: Chuẩn Bị Code

### 1.1. Kiểm tra các file cần thiết

Đảm bảo các file sau có trong project:
- ✅ `package.json` - Dependencies đã đầy đủ
- ✅ `next.config.js` - Config Next.js
- ✅ `vercel.json` - Config Vercel (đã có sẵn)
- ✅ `tsconfig.json` - TypeScript config
- ✅ `.gitignore` - Ignore node_modules, .next, etc.

### 1.2. Test build local

```bash
# Cài dependencies
npm install

# Test build
npm run build

# Nếu build thành công, bạn đã sẵn sàng deploy!
```

## Bước 2: Push Code Lên GitHub

### 2.1. Khởi tạo Git (nếu chưa có)

```bash
cd zim-sat-math-web

# Kiểm tra xem đã có git chưa
git status

# Nếu chưa có, khởi tạo:
git init
git add .
git commit -m "Initial commit: SAT Math Solver web app"
```

### 2.2. Tạo repository trên GitHub

1. Vào https://github.com/new
2. Tạo repository mới (ví dụ: `zim-sat-math-web`)
3. **KHÔNG** tích vào "Initialize with README" (vì bạn đã có code rồi)

### 2.3. Push code lên GitHub

```bash
# Thêm remote
git remote add origin https://github.com/your-username/zim-sat-math-web.git

# Push code
git branch -M main
git push -u origin main
```

## Bước 3: Deploy Lên Vercel

### 3.1. Đăng nhập Vercel

1. Vào https://vercel.com
2. Click **"Sign Up"** hoặc **"Log In"**
3. Chọn **"Continue with GitHub"** để đăng nhập bằng GitHub account

### 3.2. Import Project

1. Sau khi đăng nhập, click **"Add New..."** → **"Project"**
2. Chọn repository `zim-sat-math-web` của bạn
3. Click **"Import"**

### 3.3. Cấu Hình Project

Vercel sẽ tự động detect Next.js, nhưng bạn cần kiểm tra:

- **Framework Preset**: `Next.js` ✅
- **Root Directory**: `./` ✅
- **Build Command**: `npm run build` ✅
- **Output Directory**: `.next` ✅ (tự động)
- **Install Command**: `npm install` ✅

### 3.4. Cấu Hình Environment Variables

**QUAN TRỌNG**: Bạn cần set `BACKEND_URL` để front-end biết gọi API ở đâu!

1. Trong màn hình **"Configure Project"**, scroll xuống phần **"Environment Variables"**
2. Click **"Add"** để thêm biến mới:
   - **Key**: `BACKEND_URL`
   - **Value**: URL backend của bạn (ví dụ: `https://api.yourcompany.com` hoặc domain mà công ty bạn sẽ map)
   - **Environment**: Chọn cả 3: Production, Preview, Development

3. **Lưu ý**: 
   - Nếu backend chưa sẵn sàng, bạn có thể để tạm một URL test
   - Sau khi backend deploy xong, bạn có thể update lại trong Vercel Settings

### 3.5. Deploy

1. Click **"Deploy"**
2. Chờ 2-5 phút để Vercel build và deploy
3. Sau khi xong, bạn sẽ có URL như: `https://zim-sat-math-web.vercel.app`

## Bước 4: Cấu Hình Sau Khi Deploy

### 4.1. Update BACKEND_URL (Khi Backend Sẵn Sàng)

1. Vào Vercel Dashboard → Chọn project của bạn
2. Vào **Settings** → **Environment Variables**
3. Tìm `BACKEND_URL` và click **Edit**
4. Update thành URL backend thực tế (domain mà công ty bạn map)
5. Click **Save**
6. Vào **Deployments** → Click vào deployment mới nhất → **Redeploy**

### 4.2. Test Production

1. Mở URL production của bạn (ví dụ: `https://zim-sat-math-web.vercel.app`)
2. Test các chức năng:
   - Nhập bài toán và giải
   - Upload ảnh bài toán
   - Kiểm tra kết nối với backend

### 4.3. Custom Domain (Optional)

Nếu muốn dùng domain riêng:

1. Vào **Settings** → **Domains**
2. Thêm domain của bạn
3. Follow hướng dẫn để config DNS

## Bước 5: Auto-Deploy (Tự Động)

Sau khi setup xong, mỗi khi bạn:

1. Push code mới lên GitHub
2. Vercel sẽ tự động:
   - Detect changes
   - Build lại project
   - Deploy lên production

**Không cần làm gì thêm!** 🎉

## Troubleshooting

### Build Failed

**Lỗi**: `Module not found` hoặc `Type error`

**Giải pháp**:
1. Test build local trước: `npm run build`
2. Kiểm tra tất cả dependencies trong `package.json`
3. Xem build logs trên Vercel để biết lỗi cụ thể

### Backend Connection Error

**Lỗi**: Front-end không kết nối được với backend

**Giải pháp**:
1. Kiểm tra `BACKEND_URL` trong Vercel Environment Variables
2. Đảm bảo backend đã deploy và accessible
3. Kiểm tra CORS settings trên backend (phải allow domain Vercel)
4. Test backend trực tiếp: `curl https://your-backend-url.com/health`

### Environment Variables Not Working

**Lỗi**: `BACKEND_URL` không được load

**Giải pháp**:
1. Đảm bảo đã set trong Vercel Settings → Environment Variables
2. Redeploy sau khi thêm/sửa environment variables
3. Lưu ý: Environment variables chỉ available ở server-side (API routes), không phải client-side

### Desmos Calculator Not Loading

**Lỗi**: Desmos không hiển thị

**Giải pháp**:
- Desmos load từ CDN, cần internet
- Kiểm tra browser console có lỗi không
- Đảm bảo không có Content Security Policy block CDN

## Checklist Trước Khi Deploy

- [ ] Code đã push lên GitHub
- [ ] `npm run build` chạy thành công local
- [ ] Đã set `BACKEND_URL` trong Vercel Environment Variables
- [ ] Backend đã sẵn sàng (hoặc có URL test)
- [ ] Đã test các chức năng chính local

## Sau Khi Deploy

- [ ] Test production URL
- [ ] Test kết nối với backend
- [ ] Test upload ảnh
- [ ] Test giải bài toán
- [ ] Update `BACKEND_URL` khi backend production sẵn sàng

## Liên Kết Hữu Ích

- Vercel Dashboard: https://vercel.com/dashboard
- Vercel Docs: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment

---

**Chúc bạn deploy thành công! 🚀**

