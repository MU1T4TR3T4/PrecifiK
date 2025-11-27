import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            productName,
            variableCost,
            fixedCost,
            taxRate,
            cardFee,
            deliveryFee,
            desiredProfit,
            recommendedPrice
        } = body;

        // Validate required fields
        if (!productName || variableCost === undefined || fixedCost === undefined) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Create prompt for GPT-4o-mini
        const prompt = `Você é um especialista em precificação para restaurantes e food service. Analise este produto e forneça recomendações estratégicas de preço.

DADOS DO PRODUTO:
- Nome: ${productName}
- Custo Variável (ingredientes + mão de obra + embalagem): R$ ${variableCost.toFixed(2)}
- Custo Fixo Rateado por Venda: R$ ${fixedCost.toFixed(2)}
- Custo Total: R$ ${(variableCost + fixedCost).toFixed(2)}
- Impostos: ${taxRate}%
- Taxa de Cartão: ${cardFee}%
- Taxa de Delivery: ${deliveryFee}%
- Margem de Lucro Desejada: ${desiredProfit}%
- Preço Recomendado (Calculado): R$ ${recommendedPrice.toFixed(2)}

ANÁLISE SOLICITADA:
1. Avalie se o preço calculado está adequado para o mercado
2. Sugira um preço ideal considerando competitividade e lucratividade
3. Estime a probabilidade de venda neste preço (Alta/Média/Baixa)
4. Dê uma sugestão estratégica para aumentar o ticket médio ou margem

FORMATO DA RESPOSTA (JSON):
{
  "precoSugerido": [número com 2 casas decimais],
  "probabilidadeVenda": "[Alta/Média/Baixa]",
  "analise": "[análise breve em 2-3 linhas]",
  "sugestaoEstrategica": "[sugestão prática em 1-2 linhas]"
}

Responda APENAS com o JSON, sem texto adicional.`;

        // Call OpenAI API
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'Você é um consultor especializado em precificação para restaurantes. Sempre responda em português do Brasil com análises práticas e baseadas em dados.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 500,
        });

        const responseText = completion.choices[0]?.message?.content || '';

        // Parse JSON response
        let aiResponse;
        try {
            // Remove markdown code blocks if present
            const cleanedResponse = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            aiResponse = JSON.parse(cleanedResponse);
        } catch (parseError) {
            console.error('Failed to parse AI response:', responseText);
            // Fallback response
            aiResponse = {
                precoSugerido: recommendedPrice * 0.95,
                probabilidadeVenda: 'Média',
                analise: 'Análise baseada nos custos fornecidos. O preço está dentro da faixa esperada.',
                sugestaoEstrategica: 'Considere criar combos para aumentar o ticket médio.'
            };
        }

        return NextResponse.json({
            success: true,
            data: aiResponse
        });

    } catch (error: any) {
        console.error('Error in pricing AI:', error);
        return NextResponse.json(
            {
                error: 'Failed to get AI recommendation',
                details: error.message
            },
            { status: 500 }
        );
    }
}
