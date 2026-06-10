// =============================================================================
// QUESTION OPTIONS — typed JSON shapes per QuestionType
// These map to the `options` Json column in the Question model.
// =============================================================================

/** One answer choice for MCQ or TRUE_FALSE questions */
export interface QuestionOption {
  text: string;
  isCorrect: boolean;
}

/** `options` payload when questionType === 'MCQ' or 'TRUE_FALSE' */
export interface McqOptions {
  choices: QuestionOption[];
}

/** `options` payload when questionType === 'FILL_BLANK' */
export interface FillBlankOptions {
  acceptedAnswers: string[];
  caseSensitive: boolean;
}

/** Discriminated union — use this instead of `any` for Question.options */
export type QuestionOptions = McqOptions | FillBlankOptions;
