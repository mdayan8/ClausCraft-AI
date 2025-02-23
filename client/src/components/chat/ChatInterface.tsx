import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, User, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage } from "@shared/schema";

export function ChatInterface() {
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: chatHistory, isLoading: isLoadingHistory } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat/history"],
  });

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const res = await apiRequest("POST", "/api/chat/message", { message });
      return res.json();
    },
    onSuccess: () => {
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/chat/history"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Message Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    chatMutation.mutate(message);
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col space-y-4">
      <h2 className="text-2xl font-bold">Legal Assistant Chat</h2>

      <Card className="flex-1">
        <CardContent className="p-4 h-full flex flex-col">
          <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
            {isLoadingHistory ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : chatHistory?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <Bot className="h-12 w-12 text-primary" />
                <div>
                  <h3 className="font-semibold text-lg">Welcome to Legal Assistant</h3>
                  <p className="text-sm text-muted-foreground">
                    I'm here to help you with legal questions and contract-related matters.
                    Feel free to ask anything!
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {chatHistory?.map((chat) => (
                  <div key={chat.id} className="space-y-4">
                    <div className="flex justify-end items-start gap-2">
                      <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[80%]">
                        <p className="text-sm">{chat.message}</p>
                      </div>
                      <User className="h-6 w-6 text-primary flex-shrink-0" />
                    </div>
                    <div className="flex justify-start items-start gap-2">
                      <Bot className="h-6 w-6 text-primary flex-shrink-0" />
                      <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                        <div className="prose prose-sm max-w-none">
                          {chat.response}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {chatMutation.isPending && (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          <form onSubmit={handleSend} className="mt-4 flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask any legal question..."
              disabled={chatMutation.isPending}
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={chatMutation.isPending || !message.trim()}
              size="icon"
            >
              {chatMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}