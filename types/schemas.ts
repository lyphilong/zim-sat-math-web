// TypeScript types converted from Python Pydantic schemas

export type KnowledgeCategory =
  | "Algebra"
  | "Advanced Math"
  | "Problem Solving & Data Analysis"
  | "Geometry & Trigonometry"
  | "Foundations"
  | "Test Strategy";

export interface KnowledgeItem {
  topic: string;
  category: KnowledgeCategory;
}

export type DesmosPurpose =
  | "visualize"
  | "solve_equation"
  | "count_intersections"
  | "eliminate_choices"
  | "verify_solution";

export interface DesmosConfig {
  expressions: string[];
  sliders?: string[];
  viewport?: string;
  purpose: DesmosPurpose;
}

export type QuestionType = "multiple_choice" | "grid_in";
export type CalculatorPolicy = "no_calculator" | "calculator";
export type SkillDomain =
  | "Algebra"
  | "Advanced Math"
  | "Problem Solving & Data Analysis"
  | "Geometry & Trigonometry";
export type DifficultyBand = "easy" | "medium" | "hard";

export interface SATMeta {
  question_type: QuestionType;
  calculator_policy: CalculatorPolicy;
  skill_domain: SkillDomain;
  /** Chủ đề cụ thể trong domain, ví dụ: Linear equations, Systems of equations */
  topic?: string;
  difficulty_band?: DifficultyBand;
  time_target_seconds?: number;
}

export type AnswerFormat = "integer" | "fraction" | "decimal";
export type Rounding = "none" | "nearest_tenth" | "nearest_hundredth";
export type CorrectChoice = "A" | "B" | "C" | "D";

export interface AnswerSpec {
  choices?: string[];
  correct_choice?: CorrectChoice;
  answer_format?: AnswerFormat;
  rounding?: Rounding;
  max_chars?: number;
  units?: string;
}

export interface VocabNote {
  term_en: string;
  term_vi: string;
  part_of_speech?: string;
  definition_vi: string;
  register?: string;
  example_en?: string;
  note_vi?: string;
}

export interface ProblemLocalization {
  simplified_vi: string;
  vocab_notes: VocabNote[];
}

export interface Summary {
  givens: string[];
  constraints?: string[];
  goal: string;
  required_knowledge: KnowledgeItem[];
}

export interface Planning {
  strategy: string;
  reasoning_flow: string[];
  sat_tips?: string[];
}

export interface SolutionStep {
  step_id: number;
  description: string;
  derivation: string;
  formulas: string[];
  intermediate_result?: string;
  required_knowledge: KnowledgeItem[];
  common_traps?: string[];
  quick_check?: string;
  desmos?: DesmosConfig;
}

export type ApproachType =
  | "algebraic"
  | "formula_based"
  | "geometric_reasoning"
  | "data_analysis"
  | "exam_trick"
  | "desmos_first";

export interface SolutionPath {
  path_id: string;
  approach_type: ApproachType;
  title: string;
  planning: Planning;
  steps: SolutionStep[];
  conclusion: Conclusion;
  required_knowledge: KnowledgeItem[];
  pros?: string;
  cons?: string;
  best_when?: string;
  desmos_overview?: DesmosConfig;
}

export interface Conclusion {
  final_answer: string;
  approximation?: string;
  answer_spec?: AnswerSpec;
  verification?: string[];
  why_others_wrong?: string[];
}

export interface SATMathSolutionOutput {
  sat_meta: SATMeta;
  summary: Summary;
  answer_spec: AnswerSpec;
  solution_paths: SolutionPath[];
  recommended_path_id?: string;
  localization?: ProblemLocalization;
}

// =========================
// SAT ENGLISH SCHEMAS
// =========================

export type EnglishKnowledgeCategory =
  | 'Reading Comprehension'
  | 'Logical Reasoning'
  | 'Rhetorical Skills'
  | 'Grammar & Usage'
  | 'Test Strategy';

export interface EnglishKnowledgeItem {
  skill: string;
  category: EnglishKnowledgeCategory;
}

export type SATEnglishQuestionType =
  | 'main_idea'
  | 'based_on_findings'
  | 'inference'
  | 'weaken'
  | 'strengthen'
  | 'dual_text'
  | 'vocab_in_context'
  | 'grammar';

export type SATEnglishTextType =
  | 'science'
  | 'history'
  | 'literature'
  | 'social_science';

export interface SATEnglishMeta {
  question_type: SATEnglishQuestionType;
  text_type?: SATEnglishTextType;
  difficulty_band?: DifficultyBand;
}

export interface EnglishSummary {
  givens: string[];
  assumptions?: string[];
  goal: string;
  required_knowledge: EnglishKnowledgeItem[];
}

export interface EnglishPlanning {
  strategy: string;
  reasoning_flow: string[];
  sat_tips?: string[];
}

export interface EnglishSolutionStep {
  step_id: number;
  description: string;
  derivation: string;
  evidence_used: string[];
  required_knowledge: EnglishKnowledgeItem[];
  common_traps?: string[];
}

export type EnglishErrorType =
  | 'contradicts_text'
  | 'unsupported_inference'
  | 'irrelevant'
  | 'too_strong'
  | 'opposite_meaning';

export interface EnglishAnswerChoiceAnalysis {
  choice: CorrectChoice;
  summary: string;
  is_correct: boolean;
  error_type?: EnglishErrorType | null;
  explanation: string;
}

export interface EnglishConclusion {
  correct_choice: CorrectChoice;
  justification: string;
  why_others_wrong?: string[];
}

export type EnglishApproachType =
  | 'keyword_first'
  | 'logic_first'
  | 'elimination_first'
  | 'exam_trick';

export interface EnglishSolutionPath {
  path_id: string;
  approach_type: EnglishApproachType;
  title: string;
  planning: EnglishPlanning;
  steps: EnglishSolutionStep[];
  answer_analysis: EnglishAnswerChoiceAnalysis[];
  conclusion: EnglishConclusion;
  required_knowledge: EnglishKnowledgeItem[];
  pros?: string;
  cons?: string;
  best_when?: string;
}

export interface SATEnglishSolutionOutput {
  sat_meta: SATEnglishMeta;
  summary: EnglishSummary;
  solution_paths: EnglishSolutionPath[];
  recommended_path_id?: string;
  localization?: ProblemLocalization;
}
