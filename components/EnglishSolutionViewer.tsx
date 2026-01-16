import { SATEnglishSolutionOutput } from '@/types/schemas';
import LatexRenderer from './LatexRenderer';

interface EnglishSolutionViewerProps {
  solution: SATEnglishSolutionOutput;
  originalProblem?: string;
}

export default function EnglishSolutionViewer({
  solution,
  originalProblem,
}: EnglishSolutionViewerProps) {
  return (
    <div className="w-full">
      {/* 1. Đề bài */}
      <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
        <h2 className="text-xl font-bold mb-3">1. Đề Bài SAT English</h2>
        {originalProblem ? (
          <p className="text-gray-800 whitespace-pre-line">
            <LatexRenderer content={originalProblem} />
          </p>
        ) : (
          <p className="text-gray-500 italic">
            Đề bài gốc không có sẵn (ví dụ: câu hỏi được lấy từ hình ảnh).
          </p>
        )}
      </div>

      {/* 2. Tổng quan bài đọc */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h2 className="text-xl font-bold mb-3">2. Tổng Quan Bài Đọc</h2>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">2.1 Thông Tin Câu Hỏi</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div>
              <span className="font-medium text-gray-600">
                Dạng câu hỏi:
              </span>
              <span className="ml-2 text-gray-900">
                {solution.sat_meta.question_type.replaceAll('_', ' ')}
              </span>
            </div>
            {solution.sat_meta.text_type && (
              <div>
                <span className="font-medium text-gray-600">
                  Loại văn bản:
                </span>
                <span className="ml-2 text-gray-900">
                  {solution.sat_meta.text_type}
                </span>
              </div>
            )}
            {solution.sat_meta.difficulty_band && (
              <div>
                <span className="font-medium text-gray-600">Độ khó:</span>
                <span className="ml-2 text-gray-900 capitalize">
                  {solution.sat_meta.difficulty_band}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">2.2 Tóm Tắt Thông Tin Chính</h3>
          <div className="mb-2">
            <h4 className="text-sm font-medium mb-1">Thông tin nêu trực tiếp:</h4>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {solution.summary.givens.map((given, idx) => (
                <li key={idx}>
                  <LatexRenderer content={given} />
                </li>
              ))}
            </ul>
          </div>
          {solution.summary.assumptions &&
            solution.summary.assumptions.length > 0 && (
              <div className="mb-2">
                <h4 className="text-sm font-medium mb-1">Giả định/bối cảnh:</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {solution.summary.assumptions.map((assumption, idx) => (
                    <li key={idx}>
                      <LatexRenderer content={assumption} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          <div>
            <h4 className="text-sm font-medium mb-1">Mục tiêu câu hỏi:</h4>
            <p className="text-gray-700">
              <LatexRenderer content={solution.summary.goal} />
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">2.3 Kỹ Năng SAT English Cần Dùng</h3>
          <div className="flex flex-wrap gap-2">
            {solution.summary.required_knowledge.map((knowledge, idx) => (
              <span
                key={idx}
                className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-800"
              >
                {knowledge.category}: {knowledge.skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 2.5. Dịch nghĩa & ghi chú từ vựng */}
      {solution.localization && (
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h2 className="text-xl font-bold mb-2">
            2.5. Dịch Nghĩa &amp; Ghi Chú Từ Vựng
          </h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-yellow-900 mb-1">
                2.5.1 Dịch nghĩa đề bài (diễn giải dễ hiểu)
              </h3>
              <p className="text-sm text-yellow-900 whitespace-pre-line">
                <LatexRenderer content={solution.localization.simplified_vi} />
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-yellow-900 mb-1">
                2.5.2 Từ vựng tiếng Anh quan trọng trong đề
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
                          className={
                            idx % 2 === 0 ? 'bg-white' : 'bg-yellow-50'
                          }
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
        </div>
      )}

      {/* 3. Phân tích đáp án */}
      <div className="mb-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
        <h2 className="text-xl font-bold mb-3">
          3. Phân Tích Đáp Án &amp; Lý Do Chọn Đáp Án Đúng
        </h2>

        {solution.solution_paths.map((path) => (
          <div
            key={path.path_id}
            className="mb-4 p-3 rounded-lg bg-white border border-emerald-100"
          >
            <p className="font-semibold text-gray-900 mb-1">
              Chiến lược: {path.title}
            </p>
            <p className="text-xs text-gray-600 mb-2">
              Kiểu tiếp cận: {path.approach_type}
            </p>

            <div className="mb-3">
              <h3 className="text-sm font-medium mb-1">Kế hoạch suy luận:</h3>
              <ul className="list-decimal list-inside text-gray-700 space-y-1 text-sm">
                {path.planning.reasoning_flow.map((step, idx) => (
                  <li key={idx}>
                    <LatexRenderer content={step} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-3">
              <h3 className="text-sm font-medium mb-1">
                Phân tích từng đáp án:
              </h3>
              <div className="space-y-2 text-sm">
                {path.answer_analysis.map((choice) => (
                  <div
                    key={choice.choice}
                    className={`p-2 rounded border ${
                      choice.is_correct
                        ? 'bg-emerald-50 border-emerald-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <p className="font-semibold text-gray-900">
                      Đáp án {choice.choice}:{' '}
                      <span className="font-normal">
                        <LatexRenderer content={choice.summary} />
                      </span>
                    </p>
                    <p className="text-gray-800 mt-1">
                      <span className="font-medium">Giải thích:</span>{' '}
                      <LatexRenderer content={choice.explanation} />
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-1">Kết luận:</h3>
              <p className="text-sm text-gray-900">
                <span className="font-semibold">Đáp án đúng:</span>{' '}
                {path.conclusion.correct_choice}
              </p>
              <p className="text-sm text-gray-800 mt-1">
                <span className="font-semibold">Lý do chọn:</span>{' '}
                <LatexRenderer content={path.conclusion.justification} />
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


