'use client';

import { SolutionPath as SolutionPathType } from '@/types/schemas';
import SolutionStep from './SolutionStep';
import DesmosCalculator from './DesmosCalculator';
import LatexRenderer from './LatexRenderer';

interface SolutionPathProps {
  path: SolutionPathType;
  isRecommended?: boolean;
}

function formatApproachTypeLabel(approachType: string): string {
  switch (approachType) {
    case 'exam_trick':
      return 'Exam smartness';
    case 'desmos_first':
      return 'Desmos / Graph';
    case 'algebraic':
      return 'Algebra';
    case 'formula_based':
      return 'Formula-based';
    default:
      return approachType.replace('_', ' ');
  }
}

function getDisplayTitle(path: SolutionPathType): string {
  // Override UI title for specific approach types (without changing backend output)
  if (path.approach_type === 'exam_trick') return 'Thử đáp án cho trước';
  return path.title;
}

export default function SolutionPath({
  path,
  isRecommended = false,
}: SolutionPathProps) {
  return (
    <div
      className={`mb-8 p-6 border-2 rounded-lg ${
        isRecommended
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 bg-white'
      }`}
    >
      {isRecommended && (
        <div className="mb-4 px-3 py-1 bg-blue-500 text-white rounded-full inline-block text-sm font-medium">
          ⭐ Phương Pháp Được Khuyến Nghị
        </div>
      )}

      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">
          <LatexRenderer content={getDisplayTitle(path)} />
        </h2>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-1 text-xs rounded bg-gray-200 text-gray-700">
            {formatApproachTypeLabel(path.approach_type)}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Chiến lược:</h3>
        <p className="text-gray-700 mb-3">
          <LatexRenderer content={path.planning.strategy} />
        </p>

        <h3 className="font-semibold mb-2">Luồng suy luận:</h3>
        <ol className="list-decimal list-inside space-y-1 text-gray-700">
          {path.planning.reasoning_flow.map((step, idx) => (
            <li key={idx}>
              <LatexRenderer content={step} />
            </li>
          ))}
        </ol>

        {path.planning.sat_tips && path.planning.sat_tips.length > 0 && (
          <div className="mt-3 p-2 bg-yellow-50 rounded">
            <h4 className="font-medium text-yellow-800 mb-1">Ghi chú:</h4>
            <ul className="list-disc list-inside text-sm text-yellow-700">
              {path.planning.sat_tips.map((tip, idx) => (
                <li key={idx}>
                  <LatexRenderer content={tip} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {path.desmos_overview && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Hình ảnh tổng quan:</h3>
          <DesmosCalculator config={path.desmos_overview} height={400} />
        </div>
      )}

      <div className="mb-4">
        <h3 className="font-semibold mb-3 text-lg">Các bước giải chi tiết:</h3>
        {path.steps.map((step, idx) => (
          <SolutionStep key={step.step_id} step={step} stepNumber={idx + 1} />
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded border">
        <h3 className="font-semibold mb-3 text-base">Kết luận</h3>

        {/* Đáp án */}
        <div className="mb-3">
          <h4 className="font-medium text-sm mb-1 text-gray-800">Đáp án</h4>
          <div className="text-lg font-bold text-green-600">
            <LatexRenderer content={path.conclusion.final_answer} />
            {path.conclusion.approximation && (
              <span className="ml-2 text-sm font-normal text-gray-600">
                (≈ <LatexRenderer content={path.conclusion.approximation} />)
              </span>
            )}
          </div>
        </div>

        {/* Kiểm tra nhanh/ngược */}
        {path.conclusion.verification &&
          path.conclusion.verification.length > 0 && (
            <div className="mb-3">
              <h4 className="font-medium text-sm mb-1 text-gray-800">
                Kiểm tra nhanh/ngược
              </h4>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {path.conclusion.verification.map((check, idx) => (
                  <li key={idx}>
                    <LatexRenderer content={check} />
                  </li>
                ))}
              </ul>
            </div>
          )}

        {/* Đánh giá phương pháp */}
        {(path.pros || path.cons || path.best_when || path.conclusion.why_others_wrong) && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <h4 className="font-semibold text-sm mb-2 text-gray-900">Đánh giá phương pháp</h4>
            <div className="space-y-2 text-sm text-gray-700">
              {path.pros && (
                <p>
                  <span className="font-medium">Ưu điểm:</span>{' '}
                  <LatexRenderer content={path.pros} />
                </p>
              )}
              {path.cons && (
                <p>
                  <span className="font-medium">Nhược điểm:</span>{' '}
                  <LatexRenderer content={path.cons} />
                </p>
              )}
              {path.best_when && (
                <p>
                  <span className="font-medium">Khuyến cáo:</span>{' '}
                  <LatexRenderer content={path.best_when} />
                </p>
              )}
              {path.conclusion.why_others_wrong &&
                path.conclusion.why_others_wrong.length > 0 && (
                  <div>
                    <span className="font-medium">Ghi chú thêm về các đáp án khác:</span>
                    <ul className="list-disc list-inside text-sm text-gray-700 mt-1 space-y-1">
                      {path.conclusion.why_others_wrong.map((reason, idx) => (
                        <li key={idx}>
                          <LatexRenderer content={reason} />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

