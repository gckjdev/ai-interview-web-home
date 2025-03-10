import { NextResponse } from 'next/server';
import { TestResponse } from '@/types/chat';

// API基础URL
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

// API认证Token
const API_TOKEN = process.env.API_TOKEN || 'test_token';

/**
 * 根据激活码获取测试信息
 */
export async function GET(request: Request) {
  // 获取URL参数中的激活码
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  
  console.log(`[${new Date().toISOString()}] 获取测试信息API调用开始, 激活码:`, code);
  
  if (!code) {
    console.log(`[${new Date().toISOString()}] 缺少激活码参数`);
    return NextResponse.json(
      { error: '缺少激活码' },
      { status: 400 }
    );
  }
  
  try {
    // 调用外部API获取测试信息
    console.log(`[${new Date().toISOString()}] 调用外部API: ${API_BASE_URL}/test/activate_code/${code}`);
    
    const response = await fetch(`${API_BASE_URL}/test/activate_code/${code}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`
      }
    });
    
    console.log(`[${new Date().toISOString()}] API响应状态:`, response.status);
    
    const data = await response.json();
    console.log(`[${new Date().toISOString()}] API响应:`, {
      code: data.code,
      message: data.message
    });
    
    // 如果测试不存在或已完成，返回错误信息
    if (data.code !== "0") {
      console.log(`[${new Date().toISOString()}] 测试不可用:`, data.message);
      return NextResponse.json(
        { error: data.message || '测试不可用' },
        { status: parseInt(data.code) || 404 }
      );
    }
    
    console.log(`[${new Date().toISOString()}] 获取测试信息成功, test_id:`, data.data.test_id);
    return NextResponse.json(data.data);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] 获取测试信息出错:`, error);
    return NextResponse.json(
      { error: '获取测试信息失败', details: (error as Error).message },
      { status: 500 }
    );
  }
} 