"use client";

import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import '../styles/codeHighlight.css'; // 导入代码高亮样式

const inter = Inter({ subsets: ['latin'] });

// 扩展Chakra UI主题，使用汇丰色调
const theme = extendTheme({
  colors: {
    brand: {
      50: '#ffe5e5',
      100: '#fbb8b8',
      200: '#f28a8a',
      300: '#e95c5c',
      400: '#e02e2e',
      500: '#d70000', // 主色调，汇丰红
      600: '#b30000',
      700: '#8f0000',
      800: '#6b0000',
      900: '#470000',
    },
    gray: {
      50: '#f7fafc',
      100: '#edf2f7',
      200: '#e2e8f0',
      300: '#cbd5e0',
      400: '#a0aec0',
      500: '#718096',
      600: '#4a5568',
      700: '#2d3748',
      800: '#1a202c',
      900: '#171923',
    },
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: 'white',
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
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
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