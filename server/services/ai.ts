import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

export async function analyzeContract(content: string) {
  const prompt = `You are a legal expert analyzing a contract. Analyze the following contract carefully and provide a detailed analysis following these steps:

1. Overall Risk Assessment - Evaluate if the contract poses high, medium, or low risk
2. Summary - Provide a brief overview of the contract and key findings
3. Detailed Analysis - For each risky clause, analyze:
   - Exact clause text
   - Risk level (high/medium/low)
   - Category (termination/liability/payment/confidentiality/penalties)
   - Why it's risky
   - How to improve it
4. General Recommendations - List specific improvements for the contract

Contract text:
${content}

Return ONLY a JSON response with EXACTLY this structure (without any additional text before or after):
{
  "summary": "Brief overview of the contract and overall assessment",
  "overall_risk": "high|medium|low",
  "risks": [
    {
      "type": "high|medium|low",
      "clause": "Exact clause text from contract",
      "category": "termination|liability|payment|confidentiality|penalties",
      "explanation": "Detailed explanation of why this clause is risky",
      "recommendation": "Specific suggestion for improving this clause"
    }
  ],
  "recommendations": [
    "List of specific improvements as action items"
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
      // Clean the response text to ensure it only contains the JSON part
      const jsonStr = response.generated_text.trim().replace(/```json|```/g, '');
      const result = JSON.parse(jsonStr);

      // Validate the response structure
      if (!result.summary || !result.overall_risk || !Array.isArray(result.risks)) {
        console.error('Invalid AI response structure:', result);
        throw new Error('Invalid response format from AI');
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
  const prompt = `You are a legal expert generating a ${type} contract. Generate a clear, professional contract using these parameters:
${JSON.stringify(params, null, 2)}

Create a contract that includes:
1. Title and introduction
2. Definitions
3. Scope of agreement
4. Terms and conditions
5. Payment terms (if applicable)
6. Duration and termination
7. Confidentiality
8. Governing law

Return ONLY a JSON response with this exact structure (no other text):
{
  "content": "The complete contract text"
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
      // Clean the response text
      const jsonStr = response.generated_text.trim().replace(/```json|```/g, '');
      const result = JSON.parse(jsonStr);

      if (!result.content) {
        throw new Error('Invalid contract format');
      }

      return {
        content: result.content,
        format: 'text'
      };
    } catch (e) {
      console.error('Failed to parse AI response:', response.generated_text);
      throw new Error('Failed to generate contract - invalid response format');
    }
  } catch (error) {
    console.error('Error generating contract:', error);
    throw new Error('Failed to generate contract');
  }
}

export async function getLegalResponse(question: string) {
  const prompt = `You are a knowledgeable legal assistant. Please provide a clear, professional response to this legal question: "${question}"

Consider:
1. Explain legal concepts in plain language
2. Provide specific examples if helpful
3. Mention any important caveats or considerations
4. Suggest follow-up questions if more information is needed

Format your response to be clear and easy to read, using proper paragraphs and bullet points where appropriate.`;

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