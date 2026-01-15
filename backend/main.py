"""
FastAPI Backend for SAT Math Problem Solver
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import sys
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Add parent directory to path to import schemas
from services.schemas import SATMathSolutionOutput

app = FastAPI(title="SAT Math Solver API")

# CORS middleware để frontend có thể gọi API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ProblemRequest(BaseModel):
    problem: Optional[str] = None
    image_base64: Optional[str] = None
    image_mime_type: Optional[str] = None


@app.get("/")
async def root():
    return {"message": "SAT Math Solver API", "status": "running"}


@app.get("/health")
async def health():
    return {"status": "healthy"}


@app.post("/solve", response_model=SATMathSolutionOutput)
async def solve_problem(request: ProblemRequest):
    """
    Solve SAT math problem using LLM
    
    Args:
        request: ProblemRequest with problem text and/or image
        
    Returns:
        SATMathSolutionOutput: Complete solution with steps and Desmos configs
    """
    # Validate that at least problem text or image is provided
    if not request.problem and not request.image_base64:
        raise HTTPException(
            status_code=400,
            detail="Either problem text or image must be provided"
        )
    
    try:
        # Import LLM service
        from services.llm_service import solve_sat_problem
        
        # Call LLM service
        solution = await solve_sat_problem(
            problem=request.problem,
            image_base64=request.image_base64,
            image_mime_type=request.image_mime_type,
        )
        
        return solution
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error solving problem: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

