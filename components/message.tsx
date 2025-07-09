"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { User, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

export interface MessageProps {
  role: "user" | "assistant";
  content: string | ReactNode;
  id?: string;
}

export function Message({ role, content, id }: MessageProps) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ 
        duration: 0.4,
        ease: [0.25, 0.25, 0, 1],
        layout: { duration: 0.3 }
      }}
      layout
      className={cn(
        "flex w-full mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "relative max-w-[75%] md:max-w-[60%] group flex items-start gap-3",
          isUser ? "flex-row-reverse" : "flex-row"
        )}
      >
        {/* Avatar */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 mt-1",
            isUser
              ? "bg-gradient-to-br from-amber-500 to-yellow-600 border-amber-400/50 text-white"
              : "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200/80 text-amber-700"
          )}
        >
          {isUser ? (
            <User className="w-5 h-5" />
          ) : (
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>
          )}
        </motion.div>

        {/* Message Bubble */}
        <motion.div
          whileHover={{ scale: 1.005 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "relative rounded-2xl p-4 shadow-lg backdrop-blur-xl border min-w-[120px]",
            isUser
              ? "bg-gradient-to-br from-amber-500 to-yellow-600 text-white border-amber-400/50 rounded-br-md"
              : "bg-white/90 text-amber-900 border-amber-200/80 rounded-bl-md"
          )}
        >
          {/* Content */}
          <div className="relative z-10">
            {typeof content === "string" ? (
              <div
                className={cn(
                  "prose prose-sm max-w-none",
                  isUser
                    ? "prose-invert prose-headings:text-white prose-p:text-white/95 prose-strong:text-white prose-code:text-white/90"
                    : "prose-amber prose-headings:text-amber-900 prose-p:text-amber-800 prose-strong:text-amber-900 prose-code:text-amber-700"
                )}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code: ({ node, inline, className, children, ...props }: any) => {
                      return inline ? (
                        <code
                          className={cn(
                            "px-1.5 py-0.5 rounded text-xs font-mono",
                            isUser
                              ? "bg-white/20 text-white/95"
                              : "bg-amber-100 text-amber-700"
                          )}
                          {...props}
                        >
                          {children}
                        </code>
                      ) : (
                        <pre
                          className={cn(
                            "p-3 rounded-lg text-xs font-mono overflow-x-auto",
                            isUser
                              ? "bg-white/20 text-white/95"
                              : "bg-amber-100 text-amber-700"
                          )}
                        >
                          <code {...props}>{children}</code>
                        </pre>
                      );
                    },
                    p: ({ children }) => (
                      <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside space-y-1 my-2">{children}</ol>
                    ),
                    li: ({ children }) => (
                      <li className="leading-relaxed">{children}</li>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold">{children}</strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic">{children}</em>
                    ),
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            ) : (
              <div>{content}</div>
            )}
          </div>

          {/* Glassmorphism Effect Overlay */}
          <div
            className={cn(
              "absolute inset-0 rounded-2xl pointer-events-none",
              isUser
                ? "bg-gradient-to-br from-white/10 to-white/5 rounded-br-md"
                : "bg-gradient-to-br from-white/50 to-white/20 rounded-bl-md"
            )}
          />

          {/* Subtle Border Glow */}
          <div
            className={cn(
              "absolute inset-0 rounded-2xl opacity-30 pointer-events-none",
              isUser
                ? "bg-gradient-to-br from-amber-400/20 to-yellow-500/20 rounded-br-md"
                : "bg-gradient-to-br from-amber-400/10 to-yellow-400/5 rounded-bl-md"
            )}
          />
        </motion.div>

        {/* Hover Effects */}
        <motion.div
          className={cn(
            "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
            isUser ? "rounded-br-md" : "rounded-bl-md"
          )}
          style={{
            background: isUser
              ? "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)"
              : "linear-gradient(135deg, rgba(180,83,9,0.05) 0%, rgba(217,119,6,0.03) 100%)"
          }}
        />
      </div>
    </motion.div>
  );
}

// TextStreamMessage component for streaming responses
export function TextStreamMessage({ content }: { content: any }) {
  // Handle streaming value properly - convert to string if it's an object
  const textContent = typeof content === 'string' ? content : 
                     content && typeof content === 'object' && content.curr !== undefined ? content.curr :
                     content && typeof content === 'object' && content.value !== undefined ? content.value :
                     content?.toString() || '';
  
  return (
    <Message role="assistant" content={textContent} />
  );
}


