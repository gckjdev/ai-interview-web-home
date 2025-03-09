"use client";

import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import '../styles/codeHighlight.css'; // 导入代码高亮样式

const inter = Inter({ subsets: ['latin'] });

// 扩展Chakra UI主题，添加科技风格
const theme = extendTheme({
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'normal',
        borderRadius: 'md',
      },
      variants: {
        solid: {
          bg: 'blue.500',
          color: 'white',
          _hover: {
            bg: 'blue.600',
          },
        },
      },
    },
  },
});

// 注意：在 "use client" 组件中不能使用 metadata 导出
// metadata 需要在服务器组件中定义

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <title>AI面试助手</title>
        <meta name="description" content="使用AI技术帮助你准备面试" />
      </head>
      <body className={inter.className}>
        <ChakraProvider theme={theme}>
          {children}
        </ChakraProvider>
      </body>
    </html>
  );
} 