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
  qa_history?: Array<{ question: string; answer: string }>;
  is_over: boolean;
}

export interface AnswerResponseData {
  feedback: string;
  type: string;
  question_id: string;
}

// 添加测试信息类型
export interface TestInfo {
  test_id: string;
  activate_code: string;
  type: string;
  language: string;
  difficulty: string;
  status: string;
  job_id: string;
  job_title: string;
  user_id: string;
  user_name: string;
  question_ids: string[];
  examination_points: string[];
  test_time: number;
  create_date: string;
  start_date: string;
  expire_date: string;
  update_date: string | null;
}

// API响应格式
export interface TestResponse {
  code: string;
  message: string;
  data: TestInfo | null;
} 