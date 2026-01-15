'use client';

import LatexRenderer from './LatexRenderer';

/**
 * Component để test LaTeX rendering
 * Có thể dùng để debug
 */
export default function LatexTest() {
  const testCases = [
    '$x^2-4x+3=0$',
    '$(x-1)(x-3)=0$',
    '$x=1\\;\\text{hoặc}\\;x=3$',
    '$f(x)=0$',
    '$f(1)=1-4+3=0$',
    'Text với $x^2$ inline math',
    'Block math: $$\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$$',
  ];

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">LaTeX Test Cases</h2>
      {testCases.map((test, idx) => (
        <div key={idx} className="border p-2">
          <div className="text-xs text-gray-500 mb-1">Raw: {test}</div>
          <div>
            <LatexRenderer content={test} />
          </div>
        </div>
      ))}
    </div>
  );
}

