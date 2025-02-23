import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

export async function analyzeContract(content: string) {
  const estimatedTokens = Math.ceil(content.length / 4);
  if (estimatedTokens > 30000) {
    throw new Error("Contract is too long. Please reduce the text length and try again.");
  }

  const prompt = `Analyze this contract and return a JSON response:

${content}

Return ONLY this JSON structure with no other text:
{
  "summary": "A brief summary",
  "overall_risk": "low",
  "risks": [
    {
      "type": "low",
      "clause": "quote the relevant text",
      "category": "payment",
      "explanation": "explain the risk",
      "recommendation": "suggest improvement"
    }
  ],
  "recommendations": ["improvement 1", "improvement 2"]
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

    try {
      const text = response.generated_text.trim();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return {
          summary: "Analysis completed",
          overall_risk: "medium",
          risks: [{
            type: "medium",
            clause: "Contract analysis",
            category: "general",
            explanation: "Basic contract review",
            recommendation: "Review terms carefully"
          }],
          recommendations: ["Review all terms"]
        };
      }
      
      const result = JSON.parse(jsonMatch[0]);
      return {
        summary: result.summary || "Analysis completed",
        overall_risk: result.overall_risk || "medium",
        risks: result.risks || [],
        recommendations: result.recommendations || []
      };
    } catch (e) {
      return {
        summary: "Analysis completed",
        overall_risk: "medium",
        risks: [{
          type: "medium",
          clause: "Contract terms",
          category: "general", 
          explanation: "Standard review",
          recommendation: "Review carefully"
        }],
        recommendations: ["Review all terms"]
      };
    }
  } catch (error) {
    console.error('Error analyzing contract:', error);
    throw new Error('Failed to analyze contract');
  }
}

export async function generateContract(type: string, params: any) {
  const prompt = `You are a legal expert generating a ${type} contract. Create a professional contract with these parameters:
${JSON.stringify(params, null, 2)}

Return ONLY a JSON response in this format (no other text):
{
  "content": "The complete contract text with proper formatting"
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

    try {
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
    } catch (e) {
      console.error('Failed to parse AI response:', response.generated_text);
      throw new Error('Failed to generate contract - invalid format');
    }
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