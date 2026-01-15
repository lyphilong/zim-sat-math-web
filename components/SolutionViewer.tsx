'use client';

import { SATMathSolutionOutput } from '@/types/schemas';
import SolutionPath from './SolutionPath';
import LatexRenderer from './LatexRenderer';

interface SolutionViewerProps {
  solution: SATMathSolutionOutput;
  originalProblem?: string;
}

function getAggregatedAnswer(solution: SATMathSolutionOutput): string | null {
  // Ưu tiên voting từ tất cả các phương pháp (dựa trên conclusion.final_answer)
  const answers = solution.solution_paths
    .map((p) => p.conclusion?.final_answer)
    .filter((a): a is string => !!a)
    .map((a) => a.trim());

  if (answers.length === 0) return null;

  const counts = new Map<string, number>();
  for (const ans of answers) {
    counts.set(ans, (counts.get(ans) || 0) + 1);
  }

  let best: string | null = null;
  let bestCount = 0;
  for (const [ans, count] of counts.entries()) {
    if (count > bestCount) {
      best = ans;
      bestCount = count;
    }
  }

  // Fallback: nếu không rõ, lấy từ recommended_path
  if (!best && solution.recommended_path_id) {
    const rec = solution.solution_paths.find(
      (p) => p.path_id === solution.recommended_path_id,
    );
    if (rec?.conclusion?.final_answer) {
      best = rec.conclusion.final_answer;
    }
  }

  return best;
}

export default function SolutionViewer({
  solution,
  originalProblem,
}: SolutionViewerProps) {
  const aggregatedAnswer = getAggregatedAnswer(solution);

  return (
    <div className="w-full">
      {/* 1. Đề bài */}
      <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
        <h2 className="text-xl font-bold mb-3">1. Đề Bài</h2>
        {originalProblem ? (
          <p className="text-gray-800 whitespace-pre-line">
            <LatexRenderer content={originalProblem} />
          </p>
        ) : (
          <p className="text-gray-500 italic">
            Đề bài gốc không có sẵn (ví dụ: bài toán được lấy từ hình ảnh).
          </p>
        )}
      </div>

      {/* 2. Dịch nghĩa & ghi chú từ vựng */}
      <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h2 className="text-xl font-bold mb-2">
          2. Dịch Nghĩa &amp; Ghi Chú Từ Vựng
        </h2>
        {solution.localization ? (
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-yellow-900 mb-1">
                2.1 Dịch nghĩa đề bài (diễn giải dễ hiểu)
              </h3>
              <p className="text-sm text-yellow-900 whitespace-pre-line">
                <LatexRenderer content={solution.localization.simplified_vi} />
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-yellow-900 mb-1">
                2.2 Từ vựng tiếng Anh quan trọng trong đề
              </h3>
              {solution.localization.vocab_notes.length === 0 ? (
                <p className="text-sm text-yellow-800">
                  Không có từ vựng tiếng Anh chuyên ngành đáng lưu ý.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs md:text-sm text-left border border-yellow-200 bg-white rounded-lg overflow-hidden">
                    <thead className="bg-yellow-100">
                      <tr>
                        <th className="px-3 py-2 border-b border-yellow-200">
                          Từ / Cụm từ (EN)
                        </th>
                        <th className="px-3 py-2 border-b border-yellow-200">
                          Từ tương ứng (VI)
                        </th>
                        <th className="px-3 py-2 border-b border-yellow-200">
                          Loại từ
                        </th>
                        <th className="px-3 py-2 border-b border-yellow-200">
                          Giải thích
                        </th>
                        <th className="px-3 py-2 border-b border-yellow-200">
                          Ví dụ (EN)
                        </th>
                        <th className="px-3 py-2 border-b border-yellow-200">
                          Ghi chú
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {solution.localization.vocab_notes.map((note, idx) => (
                        <tr
                          key={idx}
                          className={idx % 2 === 0 ? 'bg-white' : 'bg-yellow-50'}
                        >
                          <td className="px-3 py-2 align-top font-semibold text-gray-900">
                            {note.term_en}
                          </td>
                          <td className="px-3 py-2 align-top text-gray-900">
                            {note.term_vi}
                          </td>
                          <td className="px-3 py-2 align-top text-gray-700">
                            {note.part_of_speech || '-'}
                            {note.register && (
                              <span className="ml-1 inline-block px-2 py-0.5 rounded-full bg-yellow-100 text-[10px] uppercase tracking-wide text-yellow-900">
                                {note.register}
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2 align-top text-gray-800">
                            {note.definition_vi}
                          </td>
                          <td className="px-3 py-2 align-top text-gray-700">
                            {note.example_en || '-'}
                          </td>
                          <td className="px-3 py-2 align-top text-gray-700">
                            {note.note_vi || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-yellow-800">
            Hệ thống sẽ tự động dịch đề bài sang tiếng Việt đơn giản hơn và chọn
            ra các từ vựng tiếng Anh chuyên ngành/học thuật quan trọng để giải
            thích cho học sinh.
          </p>
        )}
      </div>

      {/* 3. Tổng quan bài toán */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h2 className="text-xl font-bold mb-3">3. Tổng Quan Bài Toán</h2>

        {/* 3.1 Domain & độ khó */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">3.1 Thông Tin Domain &amp; Độ Khó</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
            <div>
              <span className="font-medium text-gray-600">Loại câu hỏi:</span>
              <span className="ml-2 text-gray-900">
                {solution.sat_meta.question_type.replace('_', ' ')}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Máy tính:</span>
              <span className="ml-2 text-gray-900">
                {solution.sat_meta.calculator_policy.replace('_', ' ')}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Lĩnh vực:</span>
              <span className="ml-2 text-gray-900">
                {solution.sat_meta.skill_domain}
              </span>
            </div>
            {solution.sat_meta.difficulty_band && (
              <div>
                <span className="font-medium text-gray-600">Độ khó:</span>
                <span className="ml-2 text-gray-900 capitalize">
                  {solution.sat_meta.difficulty_band}
                </span>
              </div>
            )}
          </div>
          {solution.sat_meta.time_target_seconds && (
            <div className="mt-2 text-sm">
              <span className="font-medium text-gray-600">
                Thời gian mục tiêu:
              </span>
              <span className="ml-2 text-gray-900">
                {solution.sat_meta.time_target_seconds} giây
              </span>
            </div>
          )}
        </div>

        {/* 3.2 Tóm tắt dữ kiện */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">3.2 Tóm Tắt Dữ Kiện Bài Toán</h3>
          <div className="mb-2">
            <h4 className="text-sm font-medium mb-1">Dữ kiện:</h4>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {solution.summary.givens.map((given, idx) => (
                <li key={idx}>
                  <LatexRenderer content={given} />
                </li>
              ))}
            </ul>
          </div>
          {solution.summary.constraints &&
            solution.summary.constraints.length > 0 && (
              <div className="mb-2">
                <h4 className="text-sm font-medium mb-1">Ràng buộc:</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {solution.summary.constraints.map((constraint, idx) => (
                    <li key={idx}>
                      <LatexRenderer content={constraint} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          <div>
            <h4 className="text-sm font-medium mb-1">Mục tiêu:</h4>
            <p className="text-gray-700">
              <LatexRenderer content={solution.summary.goal} />
            </p>
          </div>
        </div>

        {/* 3.3 Kiến thức cần biết */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">3.3 Kiến Thức Cần Biết</h3>
          <div className="flex flex-wrap gap-2">
            {solution.summary.required_knowledge.map((knowledge, idx) => (
              <span
                key={idx}
                className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-800"
              >
                {knowledge.category}: {knowledge.topic}
              </span>
            ))}
          </div>
        </div>

        {/* 3.4 Đáp án (voting từ các phương pháp) */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">
            3.4 Đáp án
          </h3>
          {aggregatedAnswer ? (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
              <span className="text-sm font-medium text-emerald-700">Đáp án:</span>
              <span className="ml-2 text-emerald-900 font-semibold">
                <LatexRenderer content={aggregatedAnswer} />
              </span>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Chưa đủ thông tin để tổng hợp đáp án từ các phương pháp.
            </p>
          )}
        </div>

        {/* 3.5 Tổng quan các phương pháp giải */}
        <div>
          <h3 className="font-semibold mb-2">
            3.5 Tổng Quan Các Phương Pháp Giải Toán
          </h3>
          <div className="space-y-2">
            {solution.solution_paths.map((path) => (
              <div
                key={path.path_id}
                className="p-3 rounded-lg bg-white border border-blue-100 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
              >
                <div>
                  <p className="font-semibold text-gray-900">
                    {path.title || 'Phương pháp không tiêu đề'}
                    {solution.recommended_path_id === path.path_id && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-300">
                        Khuyến nghị
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Kiểu tiếp cận: {path.approach_type}
                  </p>
                </div>
                <div className="text-xs text-gray-700 space-y-0.5">
                  {path.pros && (
                    <p>
                      <span className="font-medium">Ưu điểm:</span>{' '}
                      <LatexRenderer content={path.pros} />
                    </p>
                  )}
                  {path.best_when && (
                    <p>
                      <span className="font-medium">Nên dùng khi:</span>{' '}
                      <LatexRenderer content={path.best_when} />
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Phương pháp giải chi tiết */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">
          4. Phương Pháp Giải Chi Tiết
        </h2>
        {solution.solution_paths.map((path) => (
          <SolutionPath
            key={path.path_id}
            path={path}
            isRecommended={solution.recommended_path_id === path.path_id}
          />
        ))}
      </div>
    </div>
  );
}

