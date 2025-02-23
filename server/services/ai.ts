import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

export async function analyzeContract(content: string) {
  const prompt = `You are a legal expert analyzing a contract. Please analyze the following contract text and provide:
1. An overall risk assessment (high/medium/low)
2. A summary of key points
3. Analysis of risky clauses, focusing on:
   - Termination conditions
   - Liability and indemnification
   - Payment terms
   - Confidentiality
   - Unfair penalties
4. Specific recommendations for improving each risky clause

Contract text:
${content}

Please format your response as a strict JSON object with this structure:
{
  "summary": "Brief overview of the contract and overall assessment",
  "overall_risk": "high|medium|low",
  "risks": [
    {
      "type": "high|medium|low",
      "clause": "Exact clause text from contract",
      "category": "termination|liability|payment|confidentiality|penalties",
      "explanation": "Why this is risky",
      "recommendation": "How to improve it"
    }
  ],
  "recommendations": ["List of specific improvements"]
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

    // Ensure we get valid JSON
    try {
      const result = JSON.parse(response.generated_text);
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
  const prompt = `You are a legal expert generating a ${type} contract. Please create a contract using these parameters:
${JSON.stringify(params, null, 2)}

Generate a well-structured, legally-sound contract that includes:
1. Title and introduction
2. Definitions of key terms
3. Scope of services/agreement
4. Payment terms (if applicable)
5. Duration and termination
6. Responsibilities of each party
7. Confidentiality
8. Governing law
9. Signatures

Format the contract in a clear, professional structure. Return ONLY a JSON response with this format:
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

    // Ensure we get valid JSON
    try {
      const result = JSON.parse(response.generated_text);
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

    return response.generated_text;
  } catch (error) {
    console.error('Error getting legal response:', error);
    throw new Error('Failed to get legal response');
  }
}