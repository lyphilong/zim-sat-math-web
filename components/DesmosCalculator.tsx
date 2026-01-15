'use client';

import { useEffect, useRef } from 'react';
import { DesmosConfig } from '@/types/schemas';

interface DesmosCalculatorProps {
  config: DesmosConfig;
  height?: number;
}

declare global {
  interface Window {
    Desmos?: {
      GraphingCalculator: (container: HTMLElement, options?: any) => any;
    };
  }
}

export default function DesmosCalculator({
  config,
  height = 400,
}: DesmosCalculatorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const calculatorRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const initializeCalculator = () => {
      if (!containerRef.current || !window.Desmos) return;

      // Initialize calculator
      const calculator = window.Desmos.GraphingCalculator(
        containerRef.current,
        {
          keypad: false,
          expressions: false,
        }
      );

      calculatorRef.current = calculator;

      // Set expressions
      config.expressions.forEach((expr, idx) => {
        calculator.setExpression({ 
          id: `expr_${idx}`,
          latex: expr 
        });
      });

      // Set viewport if provided
      if (config.viewport) {
        // Parse viewport string like "x∈[-10,10], y∈[-10,10]"
        const xMatch = config.viewport.match(/x∈\[(-?\d+),(-?\d+)\]/);
        const yMatch = config.viewport.match(/y∈\[(-?\d+),(-?\d+)\]/);
        
        if (xMatch && yMatch) {
          calculator.setMathBounds({
            left: parseFloat(xMatch[1]),
            right: parseFloat(xMatch[2]),
            bottom: parseFloat(yMatch[1]),
            top: parseFloat(yMatch[2]),
          });
        }
      }

      // Set sliders if provided
      if (config.sliders) {
        config.sliders.forEach((slider) => {
          calculator.setExpression({
            id: slider,
            latex: `${slider}=1`,
            sliderBounds: { min: -10, max: 10, step: 0.1 },
          });
        });
      }

    };

    // Check if Desmos is already loaded
    if (window.Desmos) {
      initializeCalculator();
      return;
    }

    // Load Desmos Calculator API
    const script = document.createElement('script');
    script.src = 'https://www.desmos.com/api/v1.8/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6';
    script.async = true;

    script.onload = () => {
      initializeCalculator();
    };

    script.onerror = () => {
      console.error('Failed to load Desmos API');
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup
      if (calculatorRef.current) {
        try {
          calculatorRef.current.destroy();
        } catch (e) {
          console.error('Error destroying calculator:', e);
        }
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [config]);

  return (
    <div className="w-full border rounded-lg overflow-hidden bg-white">
      <div className="bg-gray-100 px-4 py-2 border-b">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Desmos Calculator
          </span>
          <span className="text-xs text-gray-500">
            {config.purpose.replace('_', ' ')}
          </span>
        </div>
      </div>
      <div ref={containerRef} style={{ height: `${height}px` }} />
    </div>
  );
}

