from pydantic import BaseModel, Field
from typing import List, Optional, Literal


# ==================================================
# 1. KNOWLEDGE UNIT (SAT-oriented)
# ==================================================

class KnowledgeItem(BaseModel):
    topic: str = Field(..., description="Kiến thức hoặc kỹ năng cụ thể")
    category: Literal[
        "Algebra",
        "Advanced Math",
        "Problem Solving & Data Analysis",
        "Geometry & Trigonometry",
        "Foundations",
        "Test Strategy"
    ] = Field(..., description="Nhóm kỹ năng theo SAT")


# ==================================================
# 2. DESMOS INTEGRATION (first-class)
# ==================================================

class DesmosConfig(BaseModel):
    expressions: List[str] = Field(
        ..., description="Biểu thức Desmos (LaTeX), ví dụ: y=x^2-4x"
    )
    sliders: Optional[List[str]] = Field(
        None, description="Biến slider nếu cần (a, b, k...)"
    )
    viewport: Optional[str] = Field(
        None, description="Khung nhìn gợi ý: x∈[-10,10], y∈[-10,10]"
    )
    purpose: Literal[
        "visualize",
        "solve_equation",
        "count_intersections",
        "eliminate_choices",
        "verify_solution"
    ] = Field(
        ..., description="Mục đích dùng Desmos trong bước này"
    )


# ==================================================
# 3. SAT METADATA
# ==================================================

class SATMeta(BaseModel):
    question_type: Literal["multiple_choice", "grid_in"]
    calculator_policy: Literal["no_calculator", "calculator"]
    skill_domain: Literal[
        "Algebra",
        "Advanced Math",
        "Problem Solving & Data Analysis",
        "Geometry & Trigonometry"
    ]
    topic: Optional[str] = Field(
        description="Chủ đề cụ thể trong domain, ví dụ: Linear equations, Systems of equations, Percent, v.v.",
    )
    difficulty_band: Optional[Literal["easy", "medium", "hard"]] = None
    time_target_seconds: Optional[int] = Field(
        None, description="Thời gian mục tiêu (giây)"
    )


# ==================================================
# 4. ANSWER SPEC (SAT-compliant)
# ==================================================

class AnswerSpec(BaseModel):
    # Multiple choice
    choices: Optional[List[str]] = None
    correct_choice: Optional[Literal["A", "B", "C", "D"]] = None

    # Grid-in
    answer_format: Optional[Literal["integer", "fraction", "decimal"]] = None
    rounding: Optional[Literal[
        "none",
        "nearest_tenth",
        "nearest_hundredth"
    ]] = None
    max_chars: Optional[int] = None

    # Common
    units: Optional[str] = None


# ==================================================
# 5. LINGUISTIC SUPPORT: TRANSLATION & VOCAB NOTES
# ==================================================

class VocabNote(BaseModel):
    term_en: str = Field(..., description="Từ/cụm từ tiếng Anh trong đề bài")
    term_vi: str = Field(..., description="Từ/cụm từ tiếng Việt tương ứng với từ/cụm từ tiếng Anh")
    part_of_speech: Optional[str] = Field(
        None, description="Loại từ (noun, verb, adjective, phrase,...) nếu phù hợp"
    )
    definition_vi: str = Field(
        ..., description="Giải thích ý nghĩa bằng tiếng Việt, giọng học thuật dễ hiểu"
    )
    academic_register: Optional[str] = Field(
        None, description="Mức độ học thuật/chuyên ngành (vd: academic, everyday, test term)"
    )
    example_en: Optional[str] = Field(
        None, description="Ví dụ câu tiếng Anh ngắn chứa từ/cụm từ đó (nếu hữu ích)"
    )
    note_vi: Optional[str] = Field(
        None, description="Ghi chú thêm cho học sinh Việt (phân biệt nghĩa, lưu ý dùng sai thường gặp)"
    )


class ProblemLocalization(BaseModel):
    simplified_vi: str = Field(
        ..., description="Dịch/diễn giải lại đề bài sang tiếng Việt đơn giản, rõ ràng cho học sinh"
    )
    vocab_notes: List[VocabNote] = Field(
        ..., description="Danh sách từ/cụm từ tiếng Anh quan trọng, mang tính học thuật/chuyên ngành trong đề bài"
    )


# ==================================================
# 6. SUMMARY (givens, constraints, goal)
# ==================================================

class Summary(BaseModel):
    givens: List[str] = Field(..., description="Dữ kiện từ đề bài")
    constraints: Optional[List[str]] = Field(
        None, description="Ràng buộc SAT (positive, integer, domain...)"
    )
    goal: str = Field(..., description="Câu hỏi cần trả lời")
    required_knowledge: List[KnowledgeItem]


# ==================================================
# 7. PLANNING (reasoning plan)
# ==================================================

class Planning(BaseModel):
    strategy: str = Field(..., description="Chiến lược tổng quát")
    reasoning_flow: List[str] = Field(
        ..., description="Chuỗi suy luận (ví dụ: equation → graph → count)"
    )
    sat_tips: Optional[List[str]] = Field(
        None, description="Mẹo SAT áp dụng cho hướng này"
    )


# ==================================================
# 8. SOLUTION STEP (Desmos lives here)
# ==================================================

class SolutionStep(BaseModel):
    step_id: int
    description: str = Field(..., description="Nội dung bước")
    derivation: str = Field(..., description="Vì sao làm bước này")
    formulas: List[str] = Field(default_factory=list)
    intermediate_result: Optional[str] = None

    required_knowledge: List[KnowledgeItem]

    # SAT extras
    common_traps: Optional[List[str]] = Field(
        None, description="Bẫy SAT thường gặp ở bước này"
    )
    quick_check: Optional[str] = Field(
        None, description="Check nhanh: thay lại, ước lượng, đơn vị"
    )

    # 🔥 DESMOS (optional per step)
    desmos: Optional[DesmosConfig] = None


# ==================================================
# 9. CONCLUSION + VERIFICATION
# ==================================================

class Conclusion(BaseModel):
    final_answer: str
    approximation: Optional[str] = None
    answer_spec: Optional[AnswerSpec] = None

    verification: Optional[List[str]] = Field(
        None, description="Danh sách bước kiểm tra đáp án"
    )
    why_others_wrong: Optional[List[str]] = Field(
        None, description="Vì sao các lựa chọn khác sai (MCQ)"
    )


# ==================================================
# 10. SOLUTION PATH (one approach)
# ==================================================

class SolutionPath(BaseModel):
    path_id: str
    approach_type: Literal[
        "algebraic",
        "formula_based",
        "geometric_reasoning",
        "data_analysis",
        "exam_trick",
        "desmos_first"
    ]
    title: str

    planning: Planning
    steps: List[SolutionStep]
    conclusion: Conclusion

    required_knowledge: List[KnowledgeItem]

    pros: Optional[str] = None
    cons: Optional[str] = None
    best_when: Optional[str] = Field(
        None, description="Khi nào nên dùng hướng này trong SAT"
    )

    # Optional: one graph for entire path
    desmos_overview: Optional[DesmosConfig] = None


# ==================================================
# 11. TOP-LEVEL OUTPUT
# ==================================================

class SATMathSolutionOutput(BaseModel):
    sat_meta: SATMeta
    summary: Summary
    answer_spec: AnswerSpec
    solution_paths: List[SolutionPath]
    recommended_path_id: Optional[str] = None

    # Ngữ nghĩa & từ vựng cho học sinh Việt Nam
    localization: Optional[ProblemLocalization] = Field(
        None,
        description=(
            "Dịch nghĩa đề bài và ghi chú từ vựng tiếng Anh quan trọng, giúp học sinh "
            "hiểu sâu ngôn ngữ học thuật trong bối cảnh SAT."
        ),
    )


    # sat_english_schema.py
# ==================================================
# SAT ENGLISH SOLUTION SCHEMA
# Compatible with SATMathSolutionOutput architecture
# ==================================================

from pydantic import BaseModel, Field
from typing import List, Optional, Literal


# ==================================================
# 1. KNOWLEDGE UNIT (SAT English–oriented)
# ==================================================

class EnglishKnowledgeItem(BaseModel):
    skill: str = Field(
        ..., description="Kỹ năng cụ thể (Inference, Elimination, Keyword tracking, etc.)"
    )
    category: Literal[
        "Reading Comprehension",
        "Logical Reasoning",
        "Rhetorical Skills",
        "Grammar & Usage",
        "Test Strategy"
    ] = Field(
        ..., description="Nhóm kỹ năng theo SAT English"
    )


# ==================================================
# 2. SAT ENGLISH METADATA
# ==================================================

class SATEnglishMeta(BaseModel):
    question_type: Literal[
        "main_idea",
        "based_on_findings",
        "inference",
        "weaken",
        "strengthen",
        "dual_text",
        "vocab_in_context",
        "grammar"
    ] = Field(..., description="Dạng câu hỏi SAT English")

    text_type: Optional[Literal[
        "science",
        "history",
        "literature",
        "social_science"
    ]] = Field(
        None, description="Loại văn bản (nếu xác định được)"
    )

    difficulty_band: Optional[Literal[
        "easy",
        "medium",
        "hard"
    ]] = Field(
        None, description="Độ khó ước lượng"
    )


# ==================================================
# 3. SUMMARY (givens, assumptions, goal)
# ==================================================

class EnglishSummary(BaseModel):
    givens: List[str] = Field(
        ..., description="Thông tin được nêu trực tiếp trong đoạn văn"
    )
    assumptions: Optional[List[str]] = Field(
        None, description="Giả định ban đầu của tác giả/giới nghiên cứu (nếu có)"
    )
    goal: str = Field(
        ..., description="Câu hỏi thực sự đang yêu cầu người làm xác định điều gì"
    )
    required_knowledge: List[EnglishKnowledgeItem]


# ==================================================
# 4. PLANNING (reasoning plan)
# ==================================================

class EnglishPlanning(BaseModel):
    strategy: str = Field(
        ..., description="Chiến lược tổng quát (keyword-first, eliminate-first, etc.)"
    )
    reasoning_flow: List[str] = Field(
        ..., description="Luồng suy luận logic (assumption → evidence → conclusion)"
    )
    sat_tips: Optional[List[str]] = Field(
        None, description="Mẹo SAT áp dụng cho hướng giải này"
    )


# ==================================================
# 5. SOLUTION STEP (logical step)
# ==================================================

class EnglishSolutionStep(BaseModel):
    step_id: int = Field(..., description="Thứ tự bước lập luận")
    description: str = Field(
        ..., description="Nội dung bước suy luận"
    )
    derivation: str = Field(
        ..., description="Vì sao bước này hợp logic"
    )
    evidence_used: List[str] = Field(
        ..., description="Từ/cụm từ trong bài được dùng làm bằng chứng"
    )
    required_knowledge: List[EnglishKnowledgeItem]

    common_traps: Optional[List[str]] = Field(
        None, description="Bẫy SAT thường gặp ở bước này"
    )


# ==================================================
# 6. ANSWER CHOICE ANALYSIS (MCQ)
# ==================================================

class EnglishAnswerChoiceAnalysis(BaseModel):
    choice: Literal["A", "B", "C", "D"]
    summary: str = Field(
        ..., description="Tóm tắt ngắn nội dung đáp án"
    )
    is_correct: bool = Field(
        ..., description="Đáp án đúng hay sai"
    )
    error_type: Optional[Literal[
        "contradicts_text",
        "unsupported_inference",
        "irrelevant",
        "too_strong",
        "opposite_meaning"
    ]] = Field(
        None, description="Nếu sai: loại lỗi SAT chuẩn"
    )
    explanation: str = Field(
        ..., description="Giải thích logic vì sao đáp án đúng hoặc sai"
    )


# ==================================================
# 7. CONCLUSION
# ==================================================

class EnglishConclusion(BaseModel):
    correct_choice: Literal["A", "B", "C", "D"]
    justification: str = Field(
        ..., description="Giải thích ngắn gọn vì sao đáp án này đúng"
    )
    why_others_wrong: Optional[List[str]] = Field(
        None, description="Vì sao các đáp án còn lại sai"
    )


# ==================================================
# 8. SOLUTION PATH (one approach)
# ==================================================

class EnglishSolutionPath(BaseModel):
    path_id: str = Field(..., description="ID của hướng giải")
    approach_type: Literal[
        "keyword_first",
        "logic_first",
        "elimination_first",
        "exam_trick"
    ] = Field(
        ..., description="Loại chiến lược giải"
    )
    title: str = Field(
        ..., description="Tên ngắn gọn của hướng giải"
    )

    planning: EnglishPlanning
    steps: List[EnglishSolutionStep]
    answer_analysis: List[EnglishAnswerChoiceAnalysis]
    conclusion: EnglishConclusion

    required_knowledge: List[EnglishKnowledgeItem]

    pros: Optional[str] = Field(
        None, description="Ưu điểm của hướng giải"
    )
    cons: Optional[str] = Field(
        None, description="Nhược điểm của hướng giải"
    )
    best_when: Optional[str] = Field(
        None, description="Khi nào nên dùng hướng này trong SAT"
    )


# ==================================================
# 9. TOP-LEVEL OUTPUT
# ==================================================

class SATEnglishSolutionOutput(BaseModel):
    sat_meta: SATEnglishMeta
    summary: EnglishSummary
    solution_paths: List[EnglishSolutionPath]
    recommended_path_id: Optional[str] = Field(
        None, description="ID của hướng giải được khuyến nghị"
    )
    # Ngữ nghĩa & từ vựng cho học sinh Việt Nam
    localization: Optional[ProblemLocalization] = Field(
        None,
        description=(
            "Dịch nghĩa đề bài và ghi chú từ vựng tiếng Anh quan trọng, giúp học sinh "
            "hiểu sâu ngôn ngữ học thuật trong bối cảnh SAT English."
        ),
    )