import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

export async function analyzeContract(content: string) {
  const prompt = `You are a legal expert analyzing a contract. Please analyze the following contract text and provide:
1. A summary of key points
2. Identification of risky clauses, particularly around:
   - Termination risks
   - Indemnity & liability issues
   - Confidentiality concerns
   - Unfair penalties
3. Specific recommendations for improving risky clauses

Contract text:
${content}

Please format your response as a JSON object with the following structure:
{
  "summary": "Brief overview of the contract",
  "risks": [
    {
      "type": "high|medium|low",
      "clause": "The specific clause text",
      "category": "termination|liability|confidentiality|penalties",
      "explanation": "Why this is risky",
      "recommendation": "How to improve it"
    }
  ],
  "recommendations": ["List of general recommendations"]
}`;

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

    return JSON.parse(response.generated_text);
  } catch (error) {
    console.error('Error analyzing contract:', error);
    throw new Error('Failed to analyze contract');
  }
}

export async function generateContract(type: string, params: any) {
  const prompt = `You are a legal expert generating a ${type} contract. Please create a contract using these parameters:
${JSON.stringify(params, null, 2)}

Generate a well-structured, legally-sound contract in markdown format. Include all necessary clauses and ensure it reflects standard legal practices.`;

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

    return {
      content: response.generated_text,
      format: 'markdown'
    };
  } catch (error) {
    console.error('Error generating contract:', error);
    throw new Error('Failed to generate contract');
  }
}

export async function getLegalResponse(question: string, contractContext?: string) {
  const prompt = `You are a legal assistant helping with contract-related questions. ${
    contractContext ? 'Consider this contract context:\n' + contractContext + '\n\n' : ''
  }Please answer this question: ${question}

Provide a clear, detailed explanation using legal expertise but in accessible language.`;

  try {
    const response = await hf.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      inputs: prompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.7,
        return_full_text: false,
      },
    });

    return response.generated_text;
  } catch (error) {
    console.error('Error getting legal response:', error);
    throw new Error('Failed to get legal response');
  }
}