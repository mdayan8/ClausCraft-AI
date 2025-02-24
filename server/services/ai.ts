import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

export async function analyzeContract(content: string) {
  const estimatedTokens = Math.ceil(content.length / 4);
  if (estimatedTokens > 30000) {
    throw new Error("Contract is too long. Please reduce the text length and try again.");
  }

  const prompt = `
You are a legal contract analysis expert. Analyze this contract carefully and provide detailed, specific feedback.
Respond in JSON format only.

Contract text:
${content}

Example response format:
{
  "riskLevel": "high",
  "clauses": [
    {
      "category": "Termination",
      "content": "Company may terminate employment at any time without notice",
      "risk": "This clause is heavily one-sided and provides no protection for the employee. It lacks proper notice period and due process.",
      "riskLevel": "high",
      "suggestion": "Modify to include: 'Either party may terminate employment with 30 days written notice. Immediate termination only for documented cause with proper due process.'"
    }
  ],
  "summary": "Contract needs significant revision to ensure fair protection for both parties. Key issues include..."
}

Instructions:
1. Break down the contract into logical clauses.
2. For each clause:
   - Identify its category (Termination, Compensation, Non-compete, etc.).
   - Assess risk level based on fairness and legal standards.
   - Provide specific, actionable suggestions for improvement.
3. Focus on:
   - One-sided terms.
   - Vague or ambiguous language.
   - Missing standard protections.
   - Unusual or potentially unfair conditions.
4. Give practical, human-like suggestions for improvements.

Return ONLY valid JSON matching the example format above.`;

  try {
    const response = await hf.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      inputs: prompt,
      parameters: {
        max_new_tokens: 2000,
        temperature: 0.7,
        return_full_text: false,
      },
    });

    const analysisText = response.generated_text?.trim() || "";

    // Clean up the response to ensure valid JSON
    let cleanedAnalysisText = analysisText.replace(/```json|```/g, '').trim();
    if (!cleanedAnalysisText.endsWith('}')) {
      cleanedAnalysisText += '}';
    }

    // Parse and validate the JSON response
    let analysis;
    try {
      analysis = JSON.parse(cleanedAnalysisText);
    } catch (error) {
      console.error("Failed to parse AI response:", error);
      throw new Error("Failed to parse contract analysis");
    }

    // Validate and normalize the response
    return {
      riskLevel: analysis.riskLevel?.toLowerCase() || "medium",
      clauses: (analysis.clauses || []).map((clause: any) => ({
        category: clause.category || "Uncategorized",
        content: clause.content || "Content not specified",
        risk: clause.risk || "Risk not specified",
        riskLevel: clause.riskLevel?.toLowerCase() || "medium",
        suggestion: clause.suggestion || "No specific suggestions provided"
      })),
      summary: analysis.summary || "Contract analysis completed"
    };

  } catch (error: any) {
    console.error("Contract analysis error:", error);
    // Provide a more specific fallback analysis
    return {
      riskLevel: "medium",
      clauses: [{
        category: "General Contract Terms",
        content: content.slice(0, 200) + "...",
        risk: "Unable to complete full analysis. Common risks in similar contracts include unclear terms, one-sided provisions, and missing standard protections.",
        riskLevel: "medium",
        suggestion: "Consider having a legal professional review the contract. Focus on clearly defining terms, ensuring mutual protections, and including standard clauses for your industry."
      }],
      summary: "The contract requires careful review. While automated analysis encountered issues, it's recommended to ensure all terms are clearly defined, mutually beneficial, and legally sound."
    };
  }
}

export async function generateContract(type: string, params: any) {
  const prompt = `You are a legal expert. Generate a professional ${type} contract with these details:
- Party A (First Party): ${params.partyA}
- Party B (Second Party): ${params.partyB}
- Additional Terms: ${params.terms || 'Standard terms apply'}

Create a properly formatted contract following these rules:
1. Include all necessary legal clauses
2. Add proper signature blocks
3. Use clear, enforceable language
4. Add standard protections for both parties

Return ONLY valid JSON in this format:
{
  "content": "THE_CONTRACT_TEXT"
}`;

  try {
    const response = await hf.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      inputs: prompt,
      parameters: {
        max_new_tokens: 2000,
        temperature: 0.7,
        return_full_text: false,
      },
    });

    // Clean and parse response
    let jsonStr = response.generated_text.trim();
    jsonStr = jsonStr.replace(/```json\n?|\n?```/g, '');
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const result = JSON.parse(jsonMatch[0]);
    if (!result.content) {
      throw new Error('Invalid contract format');
    }

    return result;
  } catch (error) {
    console.error('Error generating contract:', error);
    throw new Error('Failed to generate contract');
  }
}

export async function getLegalResponse(question: string) {
  const prompt = `You are a knowledgeable legal assistant. Provide a clear, professional response to this legal question: "${question}"

Consider:
1. Explain legal concepts in plain language
2. Provide specific examples if helpful
3. Mention important caveats or considerations
4. Suggest follow-up questions if needed`;

  try {
    const response = await hf.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      inputs: prompt,
      parameters: {
        max_new_tokens: 1000,
        temperature: 0.7,
        return_full_text: false,
      },
    });

    return response.generated_text.trim();
  } catch (error) {
    console.error('Error getting legal response:', error);
    throw new Error('Failed to get legal response');
  }
}