import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

export async function analyzeContract(content: string) {
  const prompt = `You are a legal expert analyzing a contract. Analyze the following contract carefully and provide a detailed analysis.

Contract text:
${content}

Provide your analysis in JSON format with this EXACT structure (do not include any other text):
{
  "summary": "Brief overview of findings",
  "overall_risk": "high|medium|low",
  "risks": [
    {
      "type": "high|medium|low",
      "clause": "exact clause text",
      "category": "termination|liability|payment|confidentiality|penalties",
      "explanation": "why this clause is risky",
      "recommendation": "how to improve it"
    }
  ],
  "recommendations": [
    "specific improvements"
  ]
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
      // Clean the response to ensure we only get JSON
      let jsonStr = response.generated_text.trim();
      // Remove any markdown code blocks if present
      jsonStr = jsonStr.replace(/```json\n?|\n?```/g, '');
      // Try to find JSON object if there's extra text
      const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const result = JSON.parse(jsonMatch[0]);

      // Validate required fields
      if (!result.summary || !result.overall_risk || !Array.isArray(result.risks)) {
        console.error('Invalid AI response structure:', result);
        throw new Error('Invalid response format');
      }

      return result;
    } catch (e) {
      console.error('Failed to parse AI response:', response.generated_text);
      throw new Error('Failed to analyze contract - invalid response format');
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