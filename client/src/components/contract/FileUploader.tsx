import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as pdfjsLib from 'pdfjs-dist';
import { Card } from "@/components/ui/card";
import { FileUp, Loader2 } from "lucide-react";

interface FileUploaderProps {
  onTextExtracted: (text: string) => void;
  isLoading: boolean;
}

export function FileUploader({ onTextExtracted, isLoading }: FileUploaderProps) {
  const extractTextFromPDF = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(' ') + '\n';
    }
    
    return text;
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      let text = '';
      if (file.type === 'application/pdf') {
        text = await extractTextFromPDF(file);
      } else {
        text = await file.text();
      }
      onTextExtracted(text);
    } catch (error) {
      console.error('Error processing file:', error);
    }
  }, [onTextExtracted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt']
    },
    maxFiles: 1
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
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        ) : (
          <FileUp className="h-10 w-10 text-primary" />
        )}
        <div className="space-y-2">
          <p className="text-sm font-medium">
            {isDragActive 
              ? "Drop the file here"
              : "Drag & drop contract file here, or click to select"}
          </p>
          <p className="text-xs text-muted-foreground">
            Supports PDF and TXT files
          </p>
        </div>
      </div>
    </Card>
  );
}
