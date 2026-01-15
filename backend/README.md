# SAT Math Solver Backend (Python/FastAPI)

Backend API để generate SAT math solutions sử dụng LLM.

## Setup

### 1. Cài Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Cài LLM Provider (Optional)

**LiteLLM** (hỗ trợ OpenAI, Anthropic, Cohere, Google và nhiều providers khác):
```bash
pip install litellm
```

**Note**: Nếu không cài litellm, backend sẽ dùng mock mode (không cần API key).

### 3. Cấu Hình Environment Variables

Copy `.env.example` thành `.env`:

```bash
cp .env.example .env
```

Sửa `.env`:
```bash
# Chọn provider: mock, litellm
LLM_PROVIDER=litellm

# Model name (ví dụ: gpt-4, gpt-4-turbo-preview, anthropic/claude-3-opus)
LITELLM_MODEL=gpt-4

# API Key tương ứng với model
# Nếu dùng OpenAI models:
OPENAI_API_KEY=sk-your-key-here

# Nếu dùng Anthropic models:
# ANTHROPIC_API_KEY=your-key

# Xem .env.example để biết thêm options
```

### 4. Chạy Backend

```bash
# Development
uvicorn main:app --reload --port 8000

# Hoặc
python main.py
```

Backend sẽ chạy tại: http://localhost:8000

## API Endpoints

### POST /solve

Giải bài toán SAT.

**Request:**
```json
{
  "problem": "If 2x + 5 = 15, what is the value of x?"
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

### GET /health

Health check endpoint.

## Tích Hợp với LLM

### Sử dụng OpenAI

1. Set `LLM_PROVIDER=openai` trong `.env`
2. Set `OPENAI_API_KEY` và `OPENAI_MODEL`
3. Backend sẽ tự động dùng OpenAI

### Sử dụng LiteLLM

LiteLLM hỗ trợ nhiều providers:
- OpenAI: `gpt-4`, `gpt-3.5-turbo`
- Anthropic: `anthropic/claude-3-opus`
- Cohere: `cohere/command`
- Và nhiều providers khác

1. Set `LLM_PROVIDER=litellm` trong `.env`
2. Set `LITELLM_MODEL` và API key tương ứng
3. Xem docs: https://docs.litellm.ai/

### Sử dụng Langfuse (Optional)

Để track LLM calls:

```bash
pip install langfuse
```

Set trong `.env`:
```bash
LANGFUSE_PUBLIC_KEY=your_key
LANGFUSE_SECRET_KEY=your_key
LANGFUSE_HOST=https://cloud.langfuse.com
```

Sửa `services/llm_service.py` để thêm Langfuse tracking.

## Schema

Backend sử dụng schemas từ `../../zim-sat-math/schemas.py`:
- `SATMathSolutionOutput`: Top-level response
- `SolutionPath`: Một phương pháp giải
- `SolutionStep`: Từng bước với Desmos config
- `DesmosConfig`: Cấu hình Desmos visualization

## Development

### Test API

```bash
# Health check
curl http://localhost:8000/health

# Solve problem
curl -X POST http://localhost:8000/solve \
  -H "Content-Type: application/json" \
  -d '{"problem": "If 2x + 5 = 15, what is x?"}'
```

### Debug

Backend sẽ log errors vào console. Nếu LLM không available, sẽ fallback về mock response.

## Production

### Deploy Options

1. **Vercel** (Serverless Functions)
   - Tạo `api/` folder trong Next.js app
   - Hoặc deploy riêng backend

2. **Railway/Render**
   - Deploy FastAPI app trực tiếp
   - Set environment variables

3. **Docker**
   ```dockerfile
   FROM python:3.11
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install -r requirements.txt
   COPY . .
   CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
   ```

