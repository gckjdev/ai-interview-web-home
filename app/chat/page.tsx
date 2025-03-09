"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Box, 
  Container, 
  Flex, 
  Input, 
  Button, 
  VStack, 
  Text, 
  Heading, 
  useColorModeValue,
  IconButton,
  Spinner,
  Avatar,
  useToast
} from "@chakra-ui/react";
import { FiSend, FiUser, FiRefreshCw } from "react-icons/fi";
import { Message, InterviewSession } from "@/types/chat";
import MarkdownRenderer from '@/components/MarkdownRenderer';

export default function ChatPage() {
  // 聊天消息列表
  const [messages, setMessages] = useState<Message[]>([
    {
      id: `welcome_${Date.now()}`, // 添加时间戳确保唯一性
      role: "assistant",
      content: "正在开始面试，请稍候...",
      timestamp: new Date().toISOString(),
    },
  ]);
  
  // 面试会话信息
  const [session, setSession] = useState<InterviewSession | null>(null);
  
  // 客户端状态标记
  const [isClient, setIsClient] = useState(false);
  
  // 用户输入的消息
  const [input, setInput] = useState("");
  
  // 是否正在加载（等待AI回复）
  const [isLoading, setIsLoading] = useState(false);
  
  // 聊天区域的引用，用于自动滚动
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Toast通知
  const toast = useToast();

  // 背景和文字颜色
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // 标记客户端渲染已完成
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 页面加载时自动开始面试
  useEffect(() => {
    if (isClient) {
      startInterview();
    }
  }, [isClient]);

  // 自动滚动到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 开始面试
  const startInterview = async () => {
    console.log(`[${new Date().toISOString()}] 前端开始调用开始面试API`);
    setIsLoading(true);

    try {
      // 硬编码面试参数
      const jobTitle = "前端开发工程师"; // 默认职位
      console.log(`[${new Date().toISOString()}] 面试职位:`, jobTitle);
      
      // 调用API开始面试
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ job_title: jobTitle }),
      });

      console.log(`[${new Date().toISOString()}] 开始面试API响应状态:`, response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: '未知错误' }));
        console.error(`[${new Date().toISOString()}] 开始面试API错误:`, errorData);
        throw new Error(errorData.error || "开始面试失败");
      }

      const data = await response.json();
      console.log(`[${new Date().toISOString()}] 开始面试API成功:`, {
        user_id: data.user_id,
        test_id: data.test_id,
        question_id: data.question_id
      });
      
      // 保存会话信息
      setSession({
        userId: data.user_id,
        testId: data.test_id,
        questionId: data.question_id,
        jobTitle: jobTitle,
      });

      // 清除加载消息
      setMessages([]);
      
      // 添加面试官第一个问题，确保ID唯一
      const firstQuestion: Message = {
        id: `q_${data.question_id}_${Date.now()}`, // 添加时间戳确保唯一性
        role: "assistant",
        content: data.question,
        timestamp: new Date().toISOString(),
      };

      setMessages([firstQuestion]);
    } catch (error) {
      console.error(`[${new Date().toISOString()}] 前端开始面试出错:`, error);
      
      let errorMessage = "抱歉，无法开始面试。请稍后再试。";
      
      // 如果是超时错误，显示特定提示
      if (error.message?.includes('timeout') || error.message?.includes('超时')) {
        errorMessage = "面试启动时间较长，请刷新页面重试。";
      }
      
      toast({
        title: "开始面试失败",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      
      // 添加错误消息
      const errorMsg: Message = {
        id: `error_${Date.now()}`, // 更明确的前缀
        role: "assistant",
        content: errorMessage,
        timestamp: new Date().toISOString(),
      };

      setMessages([errorMsg]);
    } finally {
      console.log(`[${new Date().toISOString()}] 前端开始面试调用完成`);
      setIsLoading(false);
    }
  };

  // 发送消息（回答问题）
  const sendMessage = async () => {
    if (!input.trim() || !session) return;

    console.log(`[${new Date().toISOString()}] 前端开始调用回答问题API`);
    
    // 添加用户消息
    const userMessage: Message = {
      id: `user_${Date.now()}`, // 使用前缀和时间戳
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // 调用API提交回答
      console.log(`[${new Date().toISOString()}] 提交参数:`, {
        user_id: session.userId,
        test_id: session.testId,
        question_id: session.questionId
      });
      
      const response = await fetch("/api/chat/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: session.userId,
          test_id: session.testId,
          question_id: session.questionId,
          user_answer: input,
        }),
      });

      console.log(`[${new Date().toISOString()}] 回答问题API响应状态:`, response.status);
      
      if (!response.ok) {
        throw new Error("提交回答失败");
      }

      const data = await response.json();
      
      // 更新当前问题ID
      setSession({
        ...session,
        questionId: data.question_id,
      });
      
      // 添加AI回复，确保ID唯一
      const aiMessage: Message = {
        id: `q_${data.question_id}_${Date.now()}`, // 添加时间戳确保唯一性
        role: "assistant",
        content: data.next_question,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(`[${new Date().toISOString()}] 前端提交回答出错:`, error);
      
      let errorMessage = "抱歉，我遇到了一些问题。请稍后再试。";
      
      // 如果是超时错误，显示特定提示
      if (error.message?.includes('timeout') || error.message?.includes('超时')) {
        errorMessage = "回答处理时间较长，请稍等片刻再试。";
      }
      
      toast({
        title: "处理回答失败",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      
      // 添加错误消息
      const errorMsg: Message = {
        id: `error_${Date.now()}`, // 更明确的前缀
        role: "assistant",
        content: errorMessage,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      console.log(`[${new Date().toISOString()}] 前端回答问题调用完成`);
      setIsLoading(false);
    }
  };

  // 处理按Enter键发送消息
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // 重新开始面试
  const restartInterview = () => {
    startInterview();
  };

  // 格式化时间显示的辅助函数
  const formatTime = (isoString: string) => {
    if (!isClient) return ""; // 客户端渲染前不显示时间
    try {
      return new Date(isoString).toLocaleTimeString();
    } catch (e) {
      return "";
    }
  };

  return (
    <Container maxW="container.md" py={8} height="100vh">
      <Flex 
        direction="column" 
        h="full" 
        bg={cardBgColor} 
        borderRadius="lg" 
        boxShadow="md"
        overflow="hidden"
      >
        {/* 聊天头部 */}
        <Flex 
          p={4} 
          borderBottom="1px" 
          borderColor={borderColor}
          bg="blue.500"
          color="white"
          align="center"
          justify="space-between"
        >
          <Heading size="md">AI面试助手</Heading>
          <IconButton
            aria-label="重新开始面试"
            icon={<FiRefreshCw />}
            size="sm"
            colorScheme="whiteAlpha"
            onClick={restartInterview}
          />
        </Flex>
        
        {/* 聊天消息区域 */}
        <VStack 
          flex="1" 
          p={4} 
          spacing={4} 
          align="stretch" 
          overflowY="auto"
          bg={bgColor}
        >
          {messages.map((msg) => (
            <Flex
              key={msg.id}
              alignSelf={msg.role === "user" ? "flex-end" : "flex-start"}
              maxW="80%"
              direction="column"
            >
              <Flex align="center" mb={1}>
                {msg.role === "assistant" ? (
                  <Avatar size="xs" bg="blue.500" mr={2} />
                ) : (
                  <Avatar size="xs" icon={<FiUser />} bg="green.500" mr={2} />
                )}
                <Text fontSize="xs" color="gray.500">
                  {msg.role === "user" ? "你" : "AI面试官"} {isClient && `· ${formatTime(msg.timestamp)}`}
                </Text>
              </Flex>
              <Box
                bg={msg.role === "user" ? "blue.500" : "gray.100"}
                color={msg.role === "user" ? "white" : "black"}
                p={3}
                borderRadius="lg"
                boxShadow="sm"
                fontSize={msg.role === "user" ? "sm" : "inherit"}
              >
                {msg.role === "assistant" ? (
                  <MarkdownRenderer content={msg.content} />
                ) : (
                  <Text fontSize="sm">{msg.content}</Text>
                )}
              </Box>
            </Flex>
          ))}
          
          {isLoading && (
            <Flex alignSelf="flex-start" maxW="80%" direction="column">
              <Flex align="center" mb={1}>
                <Avatar size="xs" bg="blue.500" mr={2} />
                <Text fontSize="xs" color="gray.500">
                  AI面试官正在思考...
                </Text>
              </Flex>
              <Box
                bg="gray.100"
                p={3}
                borderRadius="lg"
                boxShadow="sm"
              >
                <Spinner size="sm" color="blue.500" />
              </Box>
            </Flex>
          )}
          
          <div ref={messagesEndRef} />
        </VStack>
        
        {/* 输入区域 */}
        <Flex 
          p={4} 
          borderTop="1px" 
          borderColor={borderColor}
          bg={cardBgColor}
        >
          <Input
            flex="1"
            mr={2}
            placeholder={session ? "输入你的回答..." : "面试准备中..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading || !session}
          />
          <Button
            colorScheme="blue"
            onClick={sendMessage}
            isLoading={isLoading}
            leftIcon={<FiSend />}
            disabled={!input.trim() || isLoading || !session}
          >
            发送
          </Button>
        </Flex>
      </Flex>
    </Container>
  );
} 