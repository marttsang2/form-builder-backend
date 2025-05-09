export enum QuestionType {
  TEXT = 'TEXT',
  DROPDOWN = 'DROPDOWN',
  FILE = 'FILE',
}

export class CreateQuestionDto {
  label: string;
  type: QuestionType;
  order: number;
  required: boolean;
  options?: string[]; // For dropdown
}

export class CreateFormDto {
  title: string;
  description?: string;
  isLocked?: boolean = false;
  previousVersionId?: string = null;
  questions: CreateQuestionDto[];
}
