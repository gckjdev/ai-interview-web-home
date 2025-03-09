export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface InterviewSession {
  userId: string;
  testId: string;
  questionId?: string;
  jobTitle: string;
}

export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

export interface StartChatResponseData {
  feedback: string;
  type: string;
  question_id: string;
}

export interface AnswerResponseData {
  feedback: string;
  type: string;
  question_id: string;
} 