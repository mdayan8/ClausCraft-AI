import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as pdfjsLib from 'pdfjs-dist';
import { Card } from "@/components/ui/card";
import { FileUp, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploaderProps {
  onTextExtracted: (text: string) => void;
  isLoading: boolean;
}

export function FileUploader({ onTextExtracted, isLoading }: FileUploaderProps) {
  const { toast } = useToast();

  const extractTextFromPDF = async (file: File) => {
    toast({
      title: "Processing PDF",
      description: "Extracting text from your document...",
    });

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let text = '';

      toast({
        title: "Processing PDF",
        description: `Extracting text from ${pdf.numPages} pages...`,
      });

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item: any) => item.str).join(' ') + '\n';
      }

      return text;
    } catch (error) {
      console.error('Error extracting PDF text:', error);
      throw new Error('Failed to extract text from PDF');
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      toast({
        title: "Processing Document",
        description: "Starting document analysis...",
      });

      let text = '';
      if (file.type === 'application/pdf') {
        text = await extractTextFromPDF(file);
      } else if (file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        // For DOC/DOCX files, we'll read as text for now
        text = await file.text();
      } else {
        text = await file.text();
      }

      if (!text.trim()) {
        throw new Error('No text content found in the document');
      }

      toast({
        title: "Document Processed",
        description: "Successfully extracted text. Starting analysis...",
      });

      onTextExtracted(text);
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to process your document. Please try again.",
        variant: "destructive"
      });
    }
  }, [onTextExtracted, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    disabled: isLoading
  });

  return (
    <Card 
      {...getRootProps()}
      className={`p-8 border-2 border-dashed cursor-pointer transition-colors
        ${isDragActive ? 'border-primary bg-primary/5' : 'border-border'}
        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input {...getInputProps()} disabled={isLoading} />
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        {isLoading ? (
          <>
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm font-medium">Processing your document...</p>
          </>
        ) : (
          <>
            <FileUp className="h-10 w-10 text-primary" />
            <div className="space-y-2">
              <p className="text-sm font-medium">
                {isDragActive 
                  ? "Drop the file here"
                  : "Drag & drop contract file here, or click to select"}
              </p>
              <p className="text-xs text-muted-foreground">
                Supports PDF, DOC, DOCX and TXT files
              </p>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}