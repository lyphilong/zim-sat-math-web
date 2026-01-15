# LLM Integration Guide

This guide explains how to integrate your LLM API to generate SAT math solutions.

## Current Setup

The app currently uses a mock API endpoint at `app/api/solve/route.ts`. This endpoint returns a mock `SATMathSolutionOutput` response.

## Integration Steps

### 1. Update the API Route

Edit `app/api/solve/route.ts` to call your LLM API:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { SATMathSolutionOutput } from '@/types/schemas';

export async function POST(request: NextRequest) {
  try {
    const { problem } = await request.json();

    if (!problem || typeof problem !== 'string') {
      return NextResponse.json(
        { error: 'Problem text is required' },
        { status: 400 }
      );
    }

    // Call your LLM API
    const response = await fetch('YOUR_LLM_API_ENDPOINT', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.LLM_API_KEY}`, // If needed
      },
      body: JSON.stringify({
        problem: problem,
        schema: 'SATMathSolutionOutput', // Reference to your Pydantic schema
        // Add other parameters as needed
      }),
    });

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.statusText}`);
    }

    const solution: SATMathSolutionOutput = await response.json();

    // Validate response matches schema (optional but recommended)
    // You can use a library like zod for runtime validation

    return NextResponse.json(solution);
  } catch (error) {
    console.error('Error solving problem:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 2. Using Python Backend with Pydantic

If you have a Python backend using the Pydantic schemas from `zim-sat-math/schemas.py`:

#### Python Backend Example (FastAPI):

```python
from fastapi import FastAPI
from pydantic import BaseModel
from zim_sat_math.schemas import SATMathSolutionOutput

app = FastAPI()

class ProblemRequest(BaseModel):
    problem: str

@app.post("/solve", response_model=SATMathSolutionOutput)
async def solve_problem(request: ProblemRequest):
    # Your LLM logic here
    # Generate solution using your LLM
    solution = await generate_solution(request.problem)
    
    # Return Pydantic model (will be serialized to JSON)
    return solution
```

#### Update Next.js API Route:

```typescript
const response = await fetch('http://your-python-backend:8000/solve', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ problem }),
});

const solution = await response.json();
return NextResponse.json(solution);
```

### 3. Using OpenAI/Anthropic with Structured Outputs

If using OpenAI or Anthropic with structured outputs:

#### OpenAI Example:

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [
    {
      role: 'system',
      content: `You are an expert SAT math tutor. Solve the problem step-by-step and return the solution in the specified JSON schema.`,
    },
    {
      role: 'user',
      content: problem,
    },
  ],
  response_format: {
    type: 'json_schema',
    json_schema: {
      name: 'sat_math_solution',
      // Convert your Pydantic schema to JSON Schema
      // Or use a tool/function calling approach
    },
  },
});
```

### 4. Environment Variables

Create `.env.local`:

```bash
LLM_API_KEY=your_api_key_here
LLM_API_ENDPOINT=https://your-api-endpoint.com/solve
```

Add to `app/api/solve/route.ts`:

```typescript
const apiEndpoint = process.env.LLM_API_ENDPOINT || 'http://localhost:8000/solve';
const apiKey = process.env.LLM_API_KEY;
```

### 5. Error Handling

Add proper error handling:

```typescript
try {
  const solution = await fetchLLMSolution(problem);
  
  // Validate required fields
  if (!solution.sat_meta || !solution.summary || !solution.solution_paths) {
    throw new Error('Invalid solution format');
  }
  
  return NextResponse.json(solution);
} catch (error) {
  console.error('LLM Error:', error);
  
  // Return user-friendly error
  return NextResponse.json(
    { 
      error: 'Failed to generate solution. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    },
    { status: 500 }
  );
}
```

### 6. Caching (Optional)

For production, consider caching solutions:

```typescript
import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory cache (use Redis for production)
const solutionCache = new Map<string, SATMathSolutionOutput>();

export async function POST(request: NextRequest) {
  const { problem } = await request.json();
  
  // Create cache key
  const cacheKey = problem.trim().toLowerCase();
  
  // Check cache
  if (solutionCache.has(cacheKey)) {
    return NextResponse.json(solutionCache.get(cacheKey));
  }
  
  // Generate solution
  const solution = await fetchLLMSolution(problem);
  
  // Cache solution
  solutionCache.set(cacheKey, solution);
  
  return NextResponse.json(solution);
}
```

## Schema Validation

Consider adding runtime validation using Zod (matching your Pydantic schemas):

```typescript
import { z } from 'zod';

const SATMathSolutionOutputSchema = z.object({
  sat_meta: z.object({ /* ... */ }),
  summary: z.object({ /* ... */ }),
  solution_paths: z.array(/* ... */),
  // ... etc
});

// Validate before returning
const validatedSolution = SATMathSolutionOutputSchema.parse(solution);
return NextResponse.json(validatedSolution);
```

## Testing

Test your integration:

```bash
curl -X POST http://localhost:3000/api/solve \
  -H "Content-Type: application/json" \
  -d '{"problem": "If 2x + 5 = 15, what is x?"}'
```

## Next Steps

1. Replace mock endpoint with your LLM API
2. Add environment variables
3. Test with real problems
4. Add error handling and validation
5. Deploy to Vercel

