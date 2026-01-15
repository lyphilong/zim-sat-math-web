"""
Vercel Serverless Function for /api/solve endpoint
"""
import sys
import os
import json
from typing import Optional, Dict, Any

# Add backend to path
backend_path = os.path.join(os.path.dirname(__file__), 'backend')
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

from mangum import Mangum
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Import backend services
from backend.services.schemas import SATMathSolutionOutput

# Create FastAPI app
app = FastAPI(title="SAT Math Solver API")

# CORS middleware - allow all origins for Vercel deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for Vercel
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ProblemRequest(BaseModel):
    problem: Optional[str] = None
    image_base64: Optional[str] = None
    image_mime_type: Optional[str] = None


@app.post("/", response_model=SATMathSolutionOutput)
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
        from backend.services.llm_service import solve_sat_problem
        
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


# Mangum adapter to wrap FastAPI for Vercel
handler = Mangum(app, lifespan="off")


def main(request: Dict[str, Any]) -> Dict[str, Any]:
    """
    Vercel serverless function handler
    """
    return handler(request)

