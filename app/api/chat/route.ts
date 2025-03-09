import { NextResponse } from 'next/server';
import { ApiResponse, StartChatResponseData } from '@/types/chat';

// API基础URL
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

// API认证Token
const API_TOKEN = process.env.API_TOKEN || 'test_token';

// API超时时间（单位：毫秒）- 设置为120秒
const API_TIMEOUT = 120000;

// 开始面试
export async function POST(request: Request) {
  console.log(`[${new Date().toISOString()}] 开始面试API调用开始`);
  
  try {
    // 安全地尝试解析请求体，如果为空则提供默认值
    let job_title = "前端开发工程师"; // 默认职位
    
    try {
      const body = await request.json();
      // 如果请求体包含job_title，则使用它
      if (body && body.job_title) {
        job_title = body.job_title;
      }
      console.log(`[${new Date().toISOString()}] 请求参数:`, { job_title });
    } catch (e) {
      console.log(`[${new Date().toISOString()}] 请求体解析失败，使用默认职位:`, job_title);
      // 使用默认值继续
    }
    
    // 创建AbortController用于超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    
    try {
      console.log(`[${new Date().toISOString()}] 调用外部API: ${API_BASE_URL}/chat/start`);
      
      const requestBody = {
        user_id: 'user_' + Date.now().toString(),
        test_id: 'test_' + Date.now().toString(),
        job_title: job_title,
        examination_points: "React, JavaScript, TypeScript, Web基础知识",
        test_time: 3,
        language: "Chinese",
        difficulty: "easy"
      };
      
      console.log(`[${new Date().toISOString()}] 请求体:`, requestBody);
      
      // 调用外部API开始面试
      const response = await fetch(`${API_BASE_URL}/chat/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal // 添加信号控制超时
      });
      
      // 清除超时计时器
      clearTimeout(timeoutId);
      
      console.log(`[${new Date().toISOString()}] API响应状态:`, response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: '未知错误' }));
        console.error(`[${new Date().toISOString()}] API错误响应:`, errorData);
        throw new Error(`API错误: ${errorData.message || response.statusText}`);
      }
      
      const apiResponse: ApiResponse<StartChatResponseData> = await response.json();
      
      // 检查API响应状态
      if (apiResponse.code !== "0") {
        console.error(`[${new Date().toISOString()}] API业务错误:`, apiResponse);
        throw new Error(`API业务错误: ${apiResponse.message}`);
      }
      
      console.log(`[${new Date().toISOString()}] API成功响应:`, {
        code: apiResponse.code,
        message: apiResponse.message,
        question_id: apiResponse.data.question_id,
        type: apiResponse.data.type,
        // 不打印完整问题内容，避免日志过长
        feedback_preview: apiResponse.data.feedback ? apiResponse.data.feedback.substring(0, 50) + '...' : 'No feedback'
      });
      
      // 根据新的API响应结构，创建更贴近UI需要的响应
      const responseForClient = {
        user_id: requestBody.user_id,
        test_id: requestBody.test_id,
        question_id: apiResponse.data.question_id,
        question: apiResponse.data.feedback // 使用feedback作为问题内容
      };
      
      console.log(`[${new Date().toISOString()}] 开始面试API调用完成`);
      return NextResponse.json(responseForClient);
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    console.error(`[${new Date().toISOString()}] 开始面试出错:`, error);
    
    // 特别处理AbortError，显示超时信息
    if (error.name === 'AbortError') {
      console.log(`[${new Date().toISOString()}] API请求超时`);
      return NextResponse.json(
        { error: 'API请求超时，请稍后再试' },
        { status: 408 }
      );
    }
    
    return NextResponse.json(
      { error: '开始面试失败', details: (error as Error).message },
      { status: 500 }
    );
  }
} 