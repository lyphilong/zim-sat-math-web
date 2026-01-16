import { NextRequest, NextResponse } from 'next/server';
import { SATMathSolutionOutput } from '@/types/schemas';

// Proxy to Python FastAPI backend
export async function POST(request: NextRequest) {
  try {
    const { problem, image_base64, image_mime_type } = await request.json();

    if (!problem && !image_base64) {
      return NextResponse.json(
        { error: 'Problem text or image is required' },
        { status: 400 }
      );
    }

    // Get backend URL from environment variable
    // Fallback to localhost:8000 for local development
    // Format: https://backend-app.vercel.app (without trailing slash)
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    
    try {
      // Call external backend
      const apiUrl = `${backendUrl}/solve`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
        problem: problem || undefined,
        image_base64: image_base64 || undefined,
        image_mime_type: image_mime_type || undefined,
      }),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.statusText}`);
      }

      const solution: SATMathSolutionOutput = await response.json();
      return NextResponse.json(solution);
    } catch (backendError) {
      // Fallback to mock if backend is not available (for development)
      if (process.env.NODE_ENV === 'development') {
        console.warn('Backend not available, using mock response:', backendError);
        const mockSolution: SATMathSolutionOutput = {
          sat_meta: {
            question_type: 'multiple_choice',
            calculator_policy: 'calculator',
            skill_domain: 'Algebra',
            difficulty_band: 'medium',
            time_target_seconds: 120,
          },
          summary: {
            givens: [problem],
            goal: 'Find the solution',
            required_knowledge: [
              {
                topic: 'Linear equations',
                category: 'Algebra',
              },
            ],
          },
          answer_spec: {
            choices: ['A) Option 1', 'B) Option 2', 'C) Option 3', 'D) Option 4'],
            correct_choice: 'B',
          },
          solution_paths: [
            {
              path_id: 'path_1',
              approach_type: 'algebraic',
              title: 'Algebraic Approach',
              planning: {
                strategy: 'Solve using algebraic manipulation',
                reasoning_flow: [
                  'Set up the equation',
                  'Simplify',
                  'Solve for variable',
                ],
                sat_tips: ['Check your work', 'Plug back in to verify'],
              },
              steps: [
                {
                  step_id: 1,
                  description: 'Set up the initial equation',
                  derivation: 'From the problem statement',
                  formulas: ['x + 5 = 10'],
                  intermediate_result: 'x = 5',
                  required_knowledge: [
                    {
                      topic: 'Linear equations',
                      category: 'Algebra',
                    },
                  ],
                  desmos: {
                    expressions: ['y=x+5', 'y=10'],
                    purpose: 'visualize',
                    viewport: 'x∈[-10,10], y∈[-10,10]',
                  },
                },
              ],
              conclusion: {
                final_answer: '5',
                verification: ['Substitute x=5 back into original equation'],
              },
              required_knowledge: [
                {
                  topic: 'Linear equations',
                  category: 'Algebra',
                },
              ],
            },
          ],
          recommended_path_id: 'path_1',
        };

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return NextResponse.json(mockSolution);
      }
      
      // In production, return error if backend is not available
      throw backendError;
    }
  } catch (error) {
    console.error('Error solving problem:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}
