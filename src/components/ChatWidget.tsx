import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Bot, 
  X, 
  Send, 
  Sparkles,
  Youtube,
  BookOpen,
  Lightbulb,
  MessageCircle
} from "lucide-react";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  suggestions?: { title: string; url?: string; type: "video" | "tip" }[];
}

const initialMessages: Message[] = [
  {
    id: "1",
    type: "bot",
    content: "Hello! 👋 I'm your Study Assistant. I can help you with subjects like Mathematics, English, and Life Skills. I'll also recommend helpful YouTube videos to boost your learning!",
    suggestions: [
      { title: "Help me with Math", type: "tip" },
      { title: "English reading tips", type: "tip" },
      { title: "How to study better", type: "tip" },
    ],
  },
];

const sampleResponses = [
  {
    keywords: ["math", "maths", "mathematics", "number", "count"],
    response: "Great question about Mathematics! Here are some tips and videos to help you:",
    suggestions: [
      { title: "Basic Addition for Kids", url: "https://youtube.com", type: "video" as const },
      { title: "Fun Multiplication Songs", url: "https://youtube.com", type: "video" as const },
      { title: "Practice with flashcards daily", type: "tip" as const },
    ],
  },
  {
    keywords: ["english", "read", "reading", "write", "spell"],
    response: "Reading and writing are so important! Here's how I can help:",
    suggestions: [
      { title: "Phonics for Beginners", url: "https://youtube.com", type: "video" as const },
      { title: "Story Time Adventures", url: "https://youtube.com", type: "video" as const },
      { title: "Read aloud for 15 minutes every day", type: "tip" as const },
    ],
  },
  {
    keywords: ["study", "learn", "homework", "help", "better"],
    response: "I love that you want to study better! Here are my top recommendations:",
    suggestions: [
      { title: "Create a quiet study space", type: "tip" as const },
      { title: "Study Skills for Kids", url: "https://youtube.com", type: "video" as const },
      { title: "Take short breaks every 20 minutes", type: "tip" as const },
      { title: "Use colorful notes and drawings", type: "tip" as const },
    ],
  },
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string = inputValue) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const lowerText = text.toLowerCase();
    const matchedResponse = sampleResponses.find((r) =>
      r.keywords.some((k) => lowerText.includes(k))
    );

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "bot",
      content: matchedResponse?.response || 
        "That's a great question! I'm here to help you learn. Try asking me about Math, English, or study tips and I'll share helpful resources with you! 📚",
      suggestions: matchedResponse?.suggestions,
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, botMessage]);
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 gradient-primary p-4 rounded-full shadow-elevated hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bot className="h-6 w-6 text-primary-foreground" />
        <span className="absolute -top-1 -right-1 w-4 h-4 gradient-accent rounded-full animate-pulse" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] bg-card rounded-2xl shadow-elevated overflow-hidden border border-border"
          >
            {/* Header */}
            <div className="gradient-primary p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary-foreground/20 p-2 rounded-lg">
                  <Bot className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary-foreground">Study Assistant</h3>
                  <p className="text-xs text-primary-foreground/70">Always here to help</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-primary-foreground/10 transition-colors"
              >
                <X className="h-5 w-5 text-primary-foreground" />
              </button>
            </div>

            {/* Messages */}
            <div className="h-[350px] overflow-y-auto p-4 space-y-4 bg-muted/30">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 ${
                      message.type === "user"
                        ? "gradient-primary text-primary-foreground rounded-br-sm"
                        : "bg-card shadow-soft rounded-bl-sm"
                    }`}
                  >
                    <p className={`text-sm ${message.type === "bot" ? "text-foreground" : ""}`}>
                      {message.content}
                    </p>

                    {/* Suggestions */}
                    {message.suggestions && (
                      <div className="mt-3 space-y-2">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              if (suggestion.url) {
                                window.open(suggestion.url, "_blank");
                              } else {
                                handleSend(suggestion.title);
                              }
                            }}
                            className="flex items-center gap-2 w-full text-left p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-sm"
                          >
                            {suggestion.type === "video" ? (
                              <Youtube className="h-4 w-4 text-red-500 flex-shrink-0" />
                            ) : (
                              <Lightbulb className="h-4 w-4 text-gold flex-shrink-0" />
                            )}
                            <span className="text-foreground">{suggestion.title}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-card shadow-soft rounded-2xl rounded-bl-sm p-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border bg-card">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={!inputValue.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
