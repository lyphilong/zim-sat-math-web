# Hướng Dẫn Deploy Lên Vercel (Cho AI Engineer Mới Bắt Đầu)

## Vercel là gì?

Vercel là một platform để deploy web apps (đặc biệt tốt cho Next.js). Nó miễn phí cho personal projects và tự động deploy khi bạn push code lên GitHub.

## Cách 1: Deploy Qua GitHub (Dễ Nhất - Khuyến Nghị) 🚀

### Bước 1: Push Code Lên GitHub

```bash
# Nếu chưa có git repo
cd zim-sat-math-web
git init
git add .
git commit -m "Initial commit: SAT Math Solver web app"

# Tạo repo mới trên GitHub (qua web), sau đó:
git remote add origin https://github.com/your-username/zim-sat-math-web.git
git branch -M main
git push -u origin main
```

### Bước 2: Deploy Trên Vercel

1. **Vào https://vercel.com**
2. **Đăng nhập** bằng GitHub account (click "Sign Up" → chọn GitHub)
3. **Click "Add New..." → "Project"**
4. **Import Git Repository**: Chọn repo `zim-sat-math-web` của bạn
5. **Configure Project**:
   - Framework Preset: **Next.js** (tự động detect)
   - Root Directory: `./` (mặc định)
   - Build Command: `npm run build` (tự động)
   - Output Directory: `.next` (tự động)
   - Install Command: `npm install` (tự động)
6. **Click "Deploy"**

### Bước 3: Chờ Deploy Xong

- Vercel sẽ tự động:
  - Install dependencies (`npm install`)
  - Build project (`npm run build`)
  - Deploy lên production
- Mất khoảng 2-5 phút
- Sau khi xong, bạn sẽ có URL như: `https://zim-sat-math-web.vercel.app`

### Bước 4: Auto-Deploy (Tự Động)

- Mỗi khi bạn push code mới lên GitHub → Vercel tự động deploy lại
- Không cần làm gì thêm!

---

## Cách 2: Deploy Bằng Vercel CLI (Nhanh Hơn)

### Bước 1: Cài Vercel CLI

```bash
npm install -g vercel
```

### Bước 2: Login

```bash
vercel login
```

Sẽ mở browser để đăng nhập bằng GitHub.

### Bước 3: Deploy

```bash
cd zim-sat-math-web
vercel
```

CLI sẽ hỏi:
- **Set up and deploy?** → Y
- **Which scope?** → Chọn account của bạn
- **Link to existing project?** → N (lần đầu)
- **Project name?** → `zim-sat-math-web` (hoặc Enter để dùng tên folder)
- **Directory?** → `./` (Enter)
- **Override settings?** → N (Enter)

Sau đó Vercel sẽ build và deploy. Xong!

### Deploy Production

```bash
vercel --prod
```

---

## Cách 3: Deploy Từ Vercel Dashboard (Không Cần CLI)

1. Vào https://vercel.com/new
2. Chọn "Import Git Repository"
3. Chọn repo của bạn
4. Click "Deploy"

---

## Environment Variables (Nếu Cần)

Nếu bạn tích hợp LLM API và cần API keys:

### Trên Vercel Dashboard:

1. Vào project → **Settings** → **Environment Variables**
2. Thêm variables:
   - `LLM_API_KEY` = `your_key_here`
   - `LLM_API_ENDPOINT` = `https://your-api.com`
3. Click **Save**
4. Redeploy (hoặc đợi lần deploy tiếp theo)

### Hoặc Dùng CLI:

```bash
vercel env add LLM_API_KEY
# Paste value khi được hỏi
```

---

## Kiểm Tra Logs & Debug

### Trên Vercel Dashboard:

1. Vào project → **Deployments**
2. Click vào deployment mới nhất
3. Xem **Build Logs** để debug nếu có lỗi

### Hoặc Dùng CLI:

```bash
vercel logs
```

---

## Common Issues & Solutions

### Issue 1: Build Failed - Module Not Found

**Giải pháp**: Đảm bảo tất cả dependencies trong `package.json` đều đúng.

### Issue 2: Desmos Not Loading

**Giải pháp**: Desmos load từ CDN, không cần npm package. Đã được setup sẵn trong code.

### Issue 3: API Route Not Working

**Giải pháp**: 
- Kiểm tra `app/api/solve/route.ts` có đúng format không
- Xem logs trên Vercel để debug

### Issue 4: Environment Variables Not Working

**Giải pháp**:
- Đảm bảo variables được set trên Vercel Dashboard
- Redeploy sau khi thêm variables
- Variables chỉ có thể access từ server-side (API routes), không phải client-side

---

## Workflow Khuyến Nghị

1. **Development**: 
   ```bash
   npm run dev  # Test local
   ```

2. **Commit & Push**:
   ```bash
   git add .
   git commit -m "Your changes"
   git push
   ```

3. **Vercel tự động deploy** (nếu đã link GitHub)

4. **Kiểm tra**: Vào Vercel dashboard xem deployment status

---

## Tips Cho AI Engineer

- ✅ Vercel miễn phí cho personal projects
- ✅ Tự động HTTPS
- ✅ Tự động scale
- ✅ Preview deployments cho mỗi PR
- ✅ Analytics có sẵn
- ✅ Không cần config server, database, etc.

---

## Next Steps Sau Khi Deploy

1. **Test trên production URL**
2. **Tích hợp LLM API** (xem `INTEGRATION.md`)
3. **Custom domain** (nếu muốn): Settings → Domains
4. **Monitor**: Xem Analytics trên Vercel dashboard

---

## Liên Kết Hữu Ích

- Vercel Docs: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- Vercel Dashboard: https://vercel.com/dashboard

