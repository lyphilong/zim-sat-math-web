# Hướng Dẫn Deploy Backend Lên Vercel

## Tổng Quan

Backend Python FastAPI đã được đóng gói thành Vercel serverless functions:
- **File**: `api/solve.py` → Endpoint `/api/solve`
- **File**: `api/health.py` → Endpoint `/api/health`
- **Dependencies**: `requirements.txt` ở root

## Cấu Trúc

```
zim-sat-math-web/
├── api/                          # Vercel serverless functions
│   ├── solve.py                  # /api/solve endpoint
│   ├── health.py                 # /api/health endpoint
│   └── backend/                  # Backend code
│       └── services/
│           ├── llm_service.py
│           └── schemas.py
├── requirements.txt              # Python dependencies
├── vercel.json                   # Vercel config (đã update)
└── app/
    └── api/
        └── solve/
            └── route.ts          # Next.js API route (proxy)
```

## Cách Hoạt Động

1. **Frontend** (`app/page.tsx`) gọi `/api/solve` (Next.js API route)
2. **Next.js API Route** (`app/api/solve/route.ts`) gọi:
   - Nếu có `BACKEND_URL` env var → Gọi external backend
   - Nếu không có → Gọi local Vercel function `/api/solve`
3. **Vercel Function** (`api/solve.py`) xử lý request và gọi LLM service

## Environment Variables Cần Set Trên Vercel

### Bắt Buộc (nếu dùng LLM):

1. **LLM_PROVIDER**: `litellm` hoặc `mock`
   - `mock`: Dùng mock response (không cần API key)
   - `litellm`: Dùng LiteLLM với các providers khác nhau

2. **LITELLM_MODEL**: Model name
   - OpenAI: `gpt-4`, `gpt-4-turbo-preview`, `gpt-3.5-turbo`
   - Anthropic: `anthropic/claude-3-opus`, `anthropic/claude-3-sonnet`
   - Xem thêm: https://docs.litellm.ai/

3. **API Keys** (tùy vào provider):
   - OpenAI: `OPENAI_API_KEY=sk-...`
   - Anthropic: `ANTHROPIC_API_KEY=sk-ant-...`
   - Xem thêm trong `backend/README.md`

### Optional:

- **BACKEND_URL**: Nếu muốn dùng external backend thay vì Vercel function
- **LANGFUSE_***: Nếu muốn track LLM calls với Langfuse

## Cách Set Environment Variables Trên Vercel

1. Vào Vercel Dashboard → Chọn project
2. Vào **Settings** → **Environment Variables**
3. Thêm các variables:
   - `LLM_PROVIDER` = `litellm`
   - `LITELLM_MODEL` = `gpt-4` (hoặc model bạn muốn)
   - `OPENAI_API_KEY` = `sk-your-key` (hoặc key tương ứng)
4. Chọn **Environment**: Production, Preview, Development (hoặc cả 3)
5. Click **Save**
6. **Redeploy** project

## Test Sau Khi Deploy

### 1. Test Health Endpoint

```bash
curl https://your-app.vercel.app/api/health
```

Expected response:
```json
{"status": "healthy", "message": "SAT Math Solver API"}
```

### 2. Test Solve Endpoint

```bash
curl -X POST https://your-app.vercel.app/api/solve \
  -H "Content-Type: application/json" \
  -d '{"problem": "If 2x + 5 = 15, what is x?"}'
```

Expected: JSON response với solution structure

### 3. Test Từ Frontend

1. Mở https://your-app.vercel.app
2. Nhập bài toán
3. Click "Giải Bài Toán"
4. Kiểm tra kết quả

## Troubleshooting

### Lỗi: Module not found

**Nguyên nhân**: Python dependencies chưa được install

**Giải pháp**:
- Kiểm tra `requirements.txt` có đầy đủ dependencies
- Vercel sẽ tự động install từ `requirements.txt`
- Xem build logs trên Vercel để debug

### Lỗi: LLM không hoạt động

**Nguyên nhân**: 
- Chưa set environment variables
- API key sai
- Model name sai

**Giải pháp**:
1. Kiểm tra environment variables trên Vercel
2. Kiểm tra API key đúng chưa
3. Kiểm tra model name đúng format (ví dụ: `gpt-4`, `anthropic/claude-3-opus`)
4. Xem function logs trên Vercel để debug

### Lỗi: CORS

**Nguyên nhân**: CORS middleware chưa config đúng

**Giải pháp**: 
- Đã config `allow_origins=["*"]` trong `api/solve.py`
- Nếu vẫn lỗi, kiểm tra headers trong response

### Lỗi: Function timeout

**Nguyên nhân**: LLM call mất quá nhiều thời gian

**Giải pháp**:
- Vercel Hobby plan: 10s timeout
- Vercel Pro plan: 60s timeout
- Nếu cần timeout dài hơn, cần upgrade plan hoặc dùng external backend

## Development Local

Để test local trước khi deploy:

```bash
# Install Python dependencies
pip install -r requirements.txt

# Chạy Next.js dev server (sẽ tự động handle Python functions)
npm run dev
```

Frontend sẽ chạy tại http://localhost:3000
Backend functions sẽ available tại http://localhost:3000/api/solve

## Notes

- Vercel Python functions có timeout limit (10s cho Hobby, 60s cho Pro)
- Nếu LLM call mất quá nhiều thời gian, có thể cần dùng external backend
- Environment variables chỉ available ở server-side (Python functions), không phải client-side
- `BACKEND_URL` env var là optional - nếu không set, sẽ dùng local Vercel function

## Next Steps

1. ✅ Code đã được đóng gói
2. ⏳ Set environment variables trên Vercel
3. ⏳ Deploy và test
4. ⏳ Monitor logs và performance

