import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { ContractAnalyzer } from "@/components/contract/ContractAnalyzer";
import { ContractGenerator } from "@/components/contract/ContractGenerator";
import { ChatInterface } from "@/components/chat/ChatInterface";

type Tab = "analyze" | "generate" | "chat";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>("analyze");

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-6 overflow-auto">
        {activeTab === "analyze" && <ContractAnalyzer />}
        {activeTab === "generate" && <ContractGenerator />}
        {activeTab === "chat" && <ChatInterface />}
      </main>
    </div>
  );
}
