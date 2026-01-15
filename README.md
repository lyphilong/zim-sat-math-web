# SAT Math Problem Solver Web App

A Next.js web application for solving SAT math problems with step-by-step solutions and Desmos visualizations.

## Architecture

- **Frontend**: Next.js 14 (TypeScript) - Deploy trên Vercel
- **Backend**: Python FastAPI - Gọi LLM để generate solutions
- **Schemas**: Python Pydantic schemas từ `../zim-sat-math/schemas.py`

## Features

- 📝 Input SAT math problems via text
- 🧮 Step-by-step solution paths with multiple approaches
- 📊 Desmos calculator integration for visualizations
- 🎯 SAT-specific metadata and tips
- 💡 Multiple solution approaches (algebraic, geometric, Desmos-first, etc.)
- ✅ Answer verification and explanation of wrong choices

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: FastAPI (Python)
- **LLM**: OpenAI, LiteLLM (hoặc mock cho testing)
- **Visualization**: Desmos Calculator API (CDN)
- **Deployment**: Vercel (frontend) + Railway/Render (backend)

## Quick Start

### 1. Setup Backend (Python)

```bash
cd backend
pip install -r requirements.txt

# Cấu hình LLM (optional)
cp .env.example .env
# Sửa .env để set LLM_PROVIDER và API keys

# Chạy backend
uvicorn main:app --reload --port 8000
```

Backend sẽ chạy tại: http://localhost:8000

### 2. Setup Frontend (Next.js)

```bash
# Cài dependencies
npm install

# Chạy dev server
npm run dev
```

Frontend sẽ chạy tại: http://localhost:3000

**Note**: Desmos Calculator được load trực tiếp từ CDN, không cần npm package.

## Project Structure

```
zim-sat-math-web/
├── app/                    # Next.js app
│   ├── api/
│   │   └── solve/
│   │       └── route.ts    # Proxy to Python backend
│   ├── page.tsx           # Main page
│   └── layout.tsx
├── components/            # React components
│   ├── DesmosCalculator.tsx
│   ├── SolutionPath.tsx
│   ├── SolutionStep.tsx
│   └── SolutionViewer.tsx
├── backend/              # Python FastAPI backend
│   ├── main.py          # FastAPI app
│   ├── services/
│   │   └── llm_service.py  # LLM integration
│   └── requirements.txt
├── types/
│   └── schemas.ts       # TypeScript types from Python schemas
└── package.json
```

## LLM Integration

Backend hỗ trợ nhiều LLM providers:

### Option 1: OpenAI

```bash
# backend/.env
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-your-key
OPENAI_MODEL=gpt-4-turbo-preview
```

### Option 2: LiteLLM (Multiple Providers)

```bash
# backend/.env
LLM_PROVIDER=litellm
LITELLM_MODEL=anthropic/claude-3-opus
ANTHROPIC_API_KEY=your-key
```

### Option 3: Mock (Testing)

```bash
# backend/.env
LLM_PROVIDER=mock
```

Xem chi tiết: `backend/README.md`

## Deployment to Vercel

**👉 Xem file [DEPLOY.md](./DEPLOY.md) để có hướng dẫn chi tiết từng bước!**

### Quick Start (3 Bước Đơn Giản)

1. **Push code lên GitHub**:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/zim-sat-math-web.git
git push -u origin main
```

2. **Vào https://vercel.com** → Đăng nhập bằng GitHub

3. **Import repository** → Chọn repo → Click Deploy

Xong! Vercel sẽ tự động deploy và cho bạn URL như `https://your-app.vercel.app`

**Chi tiết đầy đủ**: Xem [DEPLOY.md](./DEPLOY.md) - có hướng dẫn cho AI engineer chưa biết về Vercel.

## Backend Deployment

Backend Python cần deploy riêng:

### Option 1: Railway (Dễ nhất)

1. Push backend code lên GitHub
2. Vào https://railway.app → New Project → Deploy from GitHub
3. Set environment variables
4. Railway tự động detect FastAPI và deploy

### Option 2: Render

1. Vào https://render.com → New Web Service
2. Connect GitHub repo
3. Build command: `pip install -r requirements.txt && uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Option 3: Vercel (Serverless)

Có thể deploy FastAPI lên Vercel như serverless function, nhưng phức tạp hơn.

## Environment Variables

### Frontend (.env.local)

```bash
BACKEND_URL=http://localhost:8000  # Development
# Hoặc production URL: https://your-backend.railway.app
```

### Backend (.env)

```bash
LLM_PROVIDER=openai
OPENAI_API_KEY=your_key
OPENAI_MODEL=gpt-4-turbo-preview
```

## Development Workflow

1. **Start Backend**:
```bash
cd backend
uvicorn main:app --reload --port 8000
```

2. **Start Frontend** (terminal khác):
```bash
npm run dev
```

3. **Test**: Mở http://localhost:3000

## API Reference

### POST /api/solve (Frontend)

Proxy đến Python backend.

**Request:**
```json
{
  "problem": "If 2x + 5 = 15, what is x?"
}
```

**Response:**
```json
{
  "sat_meta": {...},
  "summary": {...},
  "answer_spec": {...},
  "solution_paths": [...],
  "recommended_path_id": "path_1"
}
```

### POST /solve (Backend)

Xem `backend/README.md` để biết chi tiết.

## Schema Reference

The app uses TypeScript types converted from the Python Pydantic schemas in `../zim-sat-math/schemas.py`. Key types:

- `SATMathSolutionOutput`: Top-level solution structure
- `SolutionPath`: A complete solution approach
- `SolutionStep`: Individual step with optional Desmos visualization
- `DesmosConfig`: Desmos calculator configuration
- `SATMeta`: SAT problem metadata

## Troubleshooting

### Backend không kết nối được

- Kiểm tra backend đang chạy: `curl http://localhost:8000/health`
- Kiểm tra `BACKEND_URL` trong frontend `.env.local`
- Xem logs backend để debug

### LLM không hoạt động

- Kiểm tra `.env` trong backend folder
- Kiểm tra API keys đúng chưa
- Backend sẽ fallback về mock nếu LLM không available

### Desmos không hiển thị

- Desmos load từ CDN, cần internet
- Kiểm tra browser console có lỗi không

## License

MIT
