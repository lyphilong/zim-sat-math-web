"""
Vercel Serverless Function for /api/health endpoint
"""
import json
from typing import Dict, Any


def main(request: Dict[str, Any]) -> Dict[str, Any]:
    """
    Health check endpoint
    """
    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        "body": json.dumps({"status": "healthy", "message": "SAT Math Solver API"})
    }

