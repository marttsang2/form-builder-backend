export class AnswerDto {
  questionId: string;
  value: string; // Assuming value is always a string based on FormResponseValue.value: String
}

export class CreateFormResponseDto {
  formId: string;
  answers: AnswerDto[]; // Changed from any to AnswerDto[]
}
