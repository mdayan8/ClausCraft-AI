import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage } from "@shared/schema";

export function ChatInterface() {
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const { data: chatHistory } = useQuery<ChatMessage[]>({
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
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {chatHistory?.map((chat) => (
                <div key={chat.id} className="space-y-2">
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[80%]">
                      {chat.message}
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                      {chat.response}
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
          </ScrollArea>

          <form onSubmit={handleSend} className="mt-4 flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask a legal question..."
              disabled={chatMutation.isPending}
            />
            <Button 
              type="submit" 
              disabled={chatMutation.isPending || !message.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}