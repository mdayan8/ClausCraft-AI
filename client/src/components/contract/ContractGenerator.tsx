import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { FileText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const contractTypes = [
  { id: "nda", label: "Non-Disclosure Agreement" },
  { id: "service", label: "Service Agreement" },
  { id: "employment", label: "Employment Contract" },
  { id: "lease", label: "Lease Agreement" }
];

interface ContractFormData {
  type: string;
  partyA: string;
  partyB: string;
  terms: string;
}

export function ContractGenerator() {
  const { toast } = useToast();
  const form = useForm<ContractFormData>({
    defaultValues: {
      type: "",
      partyA: "",
      partyB: "",
      terms: ""
    }
  });

  const generateMutation = useMutation({
    mutationFn: async (data: ContractFormData) => {
      const res = await apiRequest("POST", "/api/contracts/generate", data);
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Contract Generated",
        description: "Your contract has been generated successfully."
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: ContractFormData) => {
    generateMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Contract Generator</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contract Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select contract type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {contractTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="partyA"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Party A (First Party)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter name" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="partyB"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Party B (Second Party)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter name" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Terms</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter any additional terms or conditions..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit"
                  className="w-full"
                  disabled={generateMutation.isPending}
                >
                  {generateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Contract
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            {generateMutation.data ? (
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap">
                  {generateMutation.data.content}
                </pre>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Generated contract will appear here
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
