import { FileText, FileSignature, MessageSquare, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

type Tab = "analyze" | "generate" | "chat";

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { logoutMutation } = useAuth();

  return (
    <div className="w-64 bg-sidebar border-r border-border">
      <div className="p-4">
        <h1 className="text-xl font-bold text-sidebar-foreground">ClauseCraft AI</h1>
      </div>
      <nav className="space-y-2 p-4">
        <Button
          variant={activeTab === "analyze" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("analyze")}
        >
          <FileText className="mr-2 h-4 w-4" />
          Analyze Contract
        </Button>
        <Button
          variant={activeTab === "generate" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("generate")}
        >
          <FileSignature className="mr-2 h-4 w-4" />
          Generate Contract
        </Button>
        <Button
          variant={activeTab === "chat" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("chat")}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Legal Chat
        </Button>
      </nav>
      <div className="absolute bottom-0 w-64 p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => logoutMutation.mutate()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
