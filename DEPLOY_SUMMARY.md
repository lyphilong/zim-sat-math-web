# Tóm Tắt Deploy - Frontend + Backend Cùng Một Project

## ✅ Cấu Trúc Hiện Tại

**Một project, một repo, deploy cùng lúc:**

```
zim-sat-math-web/                    # Một repo duy nhất
├── app/                             # Next.js Frontend
│   ├── page.tsx                     # Main page
│   └── api/solve/route.ts           # Next.js API route (proxy)
├── api/                             # Python Backend (Vercel Serverless)
│   ├── solve.py                     # /api/solve endpoint
│   ├── health.py                    # /api/health endpoint
│   └── backend/                     # Backend code
│       └── services/
│           ├── llm_service.py
│           └── schemas.py
├── requirements.txt                 # Python dependencies
├── package.json                     # Node.js dependencies
└── vercel.json                      # Vercel config (cả FE + BE)
```

## 🚀 Cách Vercel Build & Deploy

Khi bạn push code lên GitHub và deploy trên Vercel:

1. **Vercel tự động detect:**
   - ✅ Next.js framework → Build frontend (`npm run build`)
   - ✅ `api/*.py` files → Deploy Python serverless functions
   - ✅ `requirements.txt` → Install Python dependencies

2. **Build process:**
   ```
   Install Node.js deps (npm install)
   → Build Next.js (npm run build)
   → Install Python deps (pip install -r requirements.txt)
   → Deploy cả frontend + backend cùng lúc
   ```

3. **Kết quả:**
   - Frontend: `https://your-app.vercel.app`
   - Backend API: `https://your-app.vercel.app/api/solve`
   - **Cùng một domain, cùng một deployment!**

## 📝 Environment Variables

Set trên Vercel Dashboard → Settings → Environment Variables:

**Bắt buộc (nếu dùng LLM):**
- `LLM_PROVIDER` = `litellm` hoặc `mock`
- `LITELLM_MODEL` = `gpt-4` (hoặc model khác)
- `OPENAI_API_KEY` = `sk-...` (hoặc key tương ứng)

**Optional:**
- `BACKEND_URL` = (không cần set, sẽ dùng local Vercel function)

## ✅ Ưu Điểm Của Cách Này

1. ✅ **Một repo duy nhất** - Không cần tạo repo mới
2. ✅ **Deploy cùng lúc** - Frontend + Backend cùng một lần deploy
3. ✅ **Cùng domain** - Không cần config CORS phức tạp
4. ✅ **Dễ quản lý** - Tất cả code ở một chỗ
5. ✅ **Tự động sync** - Mỗi lần push code, cả FE + BE đều update

## 🔄 Workflow

```bash
# 1. Code changes
git add .
git commit -m "Update feature"
git push

# 2. Vercel tự động:
#    - Detect changes
#    - Build frontend (Next.js)
#    - Deploy backend (Python functions)
#    - Deploy cả hai cùng lúc

# 3. Done! 
#    Frontend + Backend đều available tại:
#    https://your-app.vercel.app
```

## 📚 Chi Tiết

- **Frontend deploy**: Xem `VERCEL_DEPLOY.md`
- **Backend deploy**: Xem `BACKEND_VERCEL_DEPLOY.md`
- **Tổng hợp**: File này

---

**Tóm lại: Một project, một repo, deploy một lần, có cả frontend và backend! 🎉**

