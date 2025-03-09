"use client";

import { Box, Button, Container, Heading, Text, VStack, useColorModeValue } from "@chakra-ui/react";
import { FiMessageSquare } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const bgColor = useColorModeValue("gray.50", "gray.900");
  
  return (
    <Box bg={bgColor} minH="100vh" py={10}>
      <Container maxW="container.md">
        <VStack spacing={8} textAlign="center">
          <Heading as="h1" size="2xl">
            AI面试助手
          </Heading>
          
          <Text fontSize="xl">
            使用AI技术帮助你准备面试，提升面试技巧，增强自信心
          </Text>
          
          <Button 
            size="lg" 
            colorScheme="blue" 
            leftIcon={<FiMessageSquare />}
            onClick={() => router.push('/chat')}
          >
            开始模拟面试
          </Button>
          
          <Box 
            p={6} 
            bg="white" 
            boxShadow="md" 
            borderRadius="lg"
            width="100%"
          >
            <Heading as="h2" size="md" mb={4}>
              为什么选择AI面试助手？
            </Heading>
            
            <VStack align="start" spacing={3}>
              <Text>✓ 随时随地进行模拟面试</Text>
              <Text>✓ 获得即时反馈和建议</Text>
              <Text>✓ 针对不同职位定制面试问题</Text>
              <Text>✓ 提高回答问题的能力和自信心</Text>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
} 