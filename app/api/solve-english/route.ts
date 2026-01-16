import { NextRequest, NextResponse } from 'next/server';
import { SATEnglishSolutionOutput } from '@/types/schemas';

// Proxy to Python FastAPI backend for SAT English
export async function POST(request: NextRequest) {
  try {
    const { problem } = await request.json();

    if (!problem) {
      return NextResponse.json(
        { error: 'Problem text is required for SAT English' },
        { status: 400 },
      );
    }

    // Get backend URL from environment variable
    // Fallback to localhost:8000 for local development
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';

    try {
      const apiUrl = `${backendUrl}/solve-english`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problem: problem || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.statusText}`);
      }

      const solution: SATEnglishSolutionOutput = await response.json();
      return NextResponse.json(solution);
    } catch (backendError) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          'SAT English backend not available, using mock response:',
          backendError,
        );

        const mockSolution: SATEnglishSolutionOutput = {
          sat_meta: {
            question_type: 'main_idea',
            text_type: 'science',
            difficulty_band: 'medium',
          },
          summary: {
            givens: [
              'Đoạn văn mô tả một nghiên cứu khoa học về tác động của ánh sáng xanh lên giấc ngủ.',
            ],
            assumptions: [
              'Người đọc hiểu bối cảnh nghiên cứu khoa học cơ bản.',
            ],
            goal: 'Xác định mục đích chính của đoạn văn.',
            required_knowledge: [
              {
                skill: 'Reading for main idea',
                category: 'Reading Comprehension',
              },
            ],
          },
          solution_paths: [
            {
              path_id: 'path_keyword',
              approach_type: 'keyword_first',
              title: 'Đọc Từ Khóa Trong Câu Hỏi Và Đoạn Văn',
              planning: {
                strategy:
                  'Tập trung vào từ khóa "primarily" và các câu mở đầu/kết luận của đoạn văn.',
                reasoning_flow: [
                  'Xác định từ khóa trong câu hỏi.',
                  'Đọc lại câu mở đầu và kết luận của đoạn văn.',
                  'So sánh với các đáp án để loại trừ.',
                ],
                sat_tips: [
                  'Câu hỏi main idea thường dựa vào toàn bộ đoạn chứ không chỉ một chi tiết nhỏ.',
                ],
              },
              steps: [
                {
                  step_id: 1,
                  description:
                    'Xác định từ khóa trong câu hỏi: "primarily concerned with".',
                  derivation:
                    'Từ khóa này cho thấy ta đang tìm mục đích chính của cả đoạn văn.',
                  evidence_used: ['primarily concerned with'],
                  required_knowledge: [
                    {
                      skill: 'Keyword tracking in questions',
                      category: 'Test Strategy',
                    },
                  ],
                  common_traps: [
                    'Nhầm lẫn giữa mục đích chính và một chi tiết thú vị trong đoạn.',
                  ],
                },
              ],
              answer_analysis: [
                {
                  choice: 'A',
                  summary:
                    'Khẳng định đoạn văn chỉ nói về lịch sử của ánh sáng xanh.',
                  is_correct: false,
                  error_type: 'irrelevant',
                  explanation:
                    'Đoạn văn chỉ nhắc nhẹ đến bối cảnh, trọng tâm là tác động lên giấc ngủ.',
                },
                {
                  choice: 'B',
                  summary:
                    'Giải thích một nghiên cứu về tác động của ánh sáng xanh lên giấc ngủ.',
                  is_correct: true,
                  error_type: null,
                  explanation:
                    'Phù hợp với các câu mô tả thiết kế nghiên cứu và kết quả chính.',
                },
                {
                  choice: 'C',
                  summary:
                    'Tranh luận rằng ánh sáng xanh hoàn toàn vô hại với con người.',
                  is_correct: false,
                  error_type: 'contradicts_text',
                  explanation:
                    'Trái với kết quả nghiên cứu cho thấy có tác động tiêu cực đến giấc ngủ.',
                },
                {
                  choice: 'D',
                  summary:
                    'Đề xuất một công nghệ mới thay thế hoàn toàn ánh sáng xanh.',
                  is_correct: false,
                  error_type: 'unsupported_inference',
                  explanation:
                    'Đoạn văn không nhắc đến giải pháp công nghệ cụ thể nào như vậy.',
                },
              ],
              conclusion: {
                correct_choice: 'B',
                justification:
                  'Đáp án B tóm tắt đúng nhất nội dung chính của đoạn: mô tả một nghiên cứu khoa học về tác động của ánh sáng xanh lên giấc ngủ.',
                why_others_wrong: [
                  'A chỉ nói về lịch sử, trong khi đoạn không tập trung vào lịch sử.',
                  'C nói điều ngược với kết luận nghiên cứu.',
                  'D thêm thông tin không hề được đề cập trong đoạn.',
                ],
              },
              required_knowledge: [
                {
                  skill: 'Reading for main idea',
                  category: 'Reading Comprehension',
                },
              ],
              pros: 'Chiến lược rõ ràng, dễ áp dụng cho hầu hết các câu main idea.',
              cons: 'Cần luyện tập để không sa đà vào chi tiết nhỏ.',
              best_when:
                'Dùng khi câu hỏi hỏi trực tiếp về mục đích chính hoặc ý chính của đoạn.',
            },
          ],
          recommended_path_id: 'path_keyword',
        };

        await new Promise((resolve) => setTimeout(resolve, 500));
        return NextResponse.json(mockSolution);
      }

      throw backendError;
    }
  } catch (error) {
    console.error('Error solving SAT English problem:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Internal server error',
        details:
          process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 },
    );
  }
}


