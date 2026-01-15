'use client';

import { SolutionStep as SolutionStepType } from '@/types/schemas';
import DesmosCalculator from './DesmosCalculator';
import LatexRenderer from './LatexRenderer';

interface SolutionStepProps {
  step: SolutionStepType;
  stepNumber: number;
}

export default function SolutionStep({ step, stepNumber }: SolutionStepProps) {
  return (
    <div className="mb-6 p-4 border rounded-lg bg-white">
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
          {stepNumber}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2">
            <LatexRenderer content={step.description} />
          </h3>
          <p className="text-gray-600 mb-3">
            <LatexRenderer content={step.derivation} />
          </p>

          {step.formulas.length > 0 && (
            <div className="mb-3">
              <h4 className="text-sm font-medium text-gray-700 mb-1">
                Công thức:
              </h4>
              <ul className="list-disc list-inside space-y-2">
                {step.formulas.map((formula, idx) => (
                  <li key={idx} className="text-sm">
                    <LatexRenderer content={formula} displayMode={true} />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {step.intermediate_result && (
            <div className="mb-3 p-2 bg-blue-50 rounded border-l-4 border-blue-500">
              <span className="text-sm font-medium text-blue-700">
                Kết quả:
              </span>
              <span className="ml-2 text-blue-900">
                <LatexRenderer content={step.intermediate_result} />
              </span>
            </div>
          )}

          {step.required_knowledge.length > 0 && (
            <div className="mb-3">
              <h4 className="text-sm font-medium text-gray-700 mb-1">
                Kiến thức cần biết:
              </h4>
              <div className="flex flex-wrap gap-2">
                {step.required_knowledge.map((knowledge, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-800"
                  >
                    {knowledge.category}: {knowledge.topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {step.common_traps && step.common_traps.length > 0 && (
            <div className="mb-3 p-2 bg-yellow-50 rounded border-l-4 border-yellow-500">
              <h4 className="text-sm font-medium text-yellow-700 mb-1">
                Bẫy thường gặp:
              </h4>
              <ul className="list-disc list-inside text-sm text-yellow-800">
                {step.common_traps.map((trap, idx) => (
                  <li key={idx}>
                    <LatexRenderer content={trap} />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Bỏ qua "Kiểm nhanh" ở từng bước theo yêu cầu */}

          {step.desmos && (
            <div className="mt-4">
              <DesmosCalculator config={step.desmos} height={350} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

