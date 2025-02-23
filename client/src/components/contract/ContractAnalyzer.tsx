import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ContractAnalyzer() {
  const [contractText, setContractText] = useState("");
  const { toast } = useToast();

  const analysisMutation = useMutation({
    mutationFn: async (text: string) => {
      const res = await apiRequest("POST", "/api/contracts/analyze", { content: text });
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Analysis Complete",
        description: "Contract analysis has been generated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = () => {
    if (!contractText.trim()) {
      toast({
        title: "Error",
        description: "Please enter contract text to analyze",
        variant: "destructive",
      });
      return;
    }
    analysisMutation.mutate(contractText);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Contract Analysis</h2>
        <Button 
          onClick={handleAnalyze}
          disabled={analysisMutation.isPending || !contractText.trim()}
        >
          {analysisMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Analyze Contract 
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <Textarea 
              placeholder="Paste your contract text here..."
              className="min-h-[400px]"
              value={contractText}
              onChange={(e) => setContractText(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            {analysisMutation.data ? (
              <div className="space-y-4">
                <h3 className="font-semibold">Analysis Results</h3>
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(analysisMutation.data, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <AlertCircle className="mr-2 h-4 w-4" />
                Analysis results will appear here
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
