'use client';

import 'katex/dist/katex.min.css';
import React from 'react';
// @ts-ignore - react-katex doesn't have type definitions
import { InlineMath, BlockMath } from 'react-katex';

interface LatexRendererProps {
  content: string;
  displayMode?: boolean;
  className?: string;
}

/**
 * Component để render LaTeX math formulas
 * Tự động detect inline math ($...$) và block math ($$...$$)
 * Xử lý escape characters từ JSON (\\ thành \)
 */
function cleanLatexContent(content: string): string {
  if (!content) return '';
  
  // Clean LaTeX content
  // Xử lý escape characters từ JSON nếu có
  let cleaned = content.trim();
  
  // Nếu có double backslashes (từ JSON), unescape
  // Nhưng cần cẩn thận với các LaTeX commands như \frac, \sqrt
  // Thường thì JSON đã được parse rồi, nên không cần unescape
  
  return cleaned;
}

function SafeMath({ 
  math, 
  isBlock, 
  className 
}: { 
  math: string; 
  isBlock: boolean; 
  className: string;
}) {
  const cleanedMath = cleanLatexContent(math);
  
  // Debug: log để kiểm tra
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('Rendering LaTeX:', { original: math, cleaned: cleanedMath, isBlock });
  }
  
  try {
    if (isBlock) {
      return <BlockMath math={cleanedMath} className={className} />;
    }
    return <InlineMath math={cleanedMath} className={className} />;
  } catch (err: any) {
    // Nếu render lỗi, hiển thị raw text với error indicator
    console.error('LaTeX rendering error:', err, 'for math:', cleanedMath);
    return (
      <span className="text-red-600 font-mono text-xs border border-red-300 px-1" title={`LaTeX Error: ${err?.message || err}`}>
        ${cleanedMath}$
      </span>
    );
  }
}

export default function LatexRenderer({ 
  content, 
  displayMode = false,
  className = '' 
}: LatexRendererProps) {
  if (!content || typeof content !== 'string') {
    return <span className={className}>{String(content)}</span>;
  }

  // Debug log
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    if (content.includes('$')) {
      console.log('LatexRenderer received:', { content, hasDollar: content.includes('$') });
    }
  }

  // Nếu content chỉ là math expression thuần túy
  const trimmed = content.trim();
  if (trimmed.startsWith('$') && trimmed.endsWith('$')) {
    const mathContent = trimmed.slice(1, -1);
    if (displayMode || trimmed.startsWith('$$')) {
      return <SafeMath math={mathContent} isBlock={true} className={className} />;
    }
    return <SafeMath math={mathContent} isBlock={false} className={className} />;
  }

  // Nếu content có cả text và math, parse và render
  const parts: (string | JSX.Element)[] = [];
  let currentIndex = 0;
  
  // Regex để tìm inline math $...$ và block math $$...$$
  const inlineMathRegex = /\$([^$]+)\$/g;
  const blockMathRegex = /\$\$([^$]+)\$\$/g;
  
  // Tìm tất cả math expressions
  const matches: Array<{ start: number; end: number; content: string; isBlock: boolean }> = [];
  
  let match;
  while ((match = blockMathRegex.exec(content)) !== null) {
    matches.push({
      start: match.index,
      end: match.index + match[0].length,
      content: match[1],
      isBlock: true,
    });
  }
  
  // Reset regex
  blockMathRegex.lastIndex = 0;
  
  while ((match = inlineMathRegex.exec(content)) !== null) {
    // Skip nếu đã được match bởi block math
    const isInBlock = matches.some(
      m => match!.index >= m.start && match!.index < m.end
    );
    if (!isInBlock) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        content: match[1],
        isBlock: false,
      });
    }
  }
  
  // Sort by start position
  matches.sort((a, b) => a.start - b.start);
  
  // Build parts array
  matches.forEach((mathMatch) => {
    // Add text before math
    if (mathMatch.start > currentIndex) {
      const text = content.slice(currentIndex, mathMatch.start);
      if (text) {
        parts.push(text);
      }
    }
    
    // Add math
    parts.push(
      <SafeMath 
        key={mathMatch.start} 
        math={mathMatch.content} 
        isBlock={mathMatch.isBlock} 
        className={className} 
      />
    );
    
    currentIndex = mathMatch.end;
  });
  
  // Add remaining text
  if (currentIndex < content.length) {
    const text = content.slice(currentIndex);
    if (text) {
      parts.push(text);
    }
  }
  
  // Nếu không có math, return text as is
  if (parts.length === 0) {
    return <span className={className}>{content}</span>;
  }
  
  return <span className={className}>{parts}</span>;
}

