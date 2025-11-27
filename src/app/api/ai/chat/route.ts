import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { message, conversationHistory, businessContext } = body;

        // Validate required fields
        if (!message) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        // Build system prompt with business context
        const systemPrompt = `Você é um consultor empresarial especializado em gestão de restaurantes e food service. Você tem acesso aos dados do negócio do usuário e deve ajudá-lo a tomar melhores decisões.

DADOS DO NEGÓCIO:
${businessContext ? JSON.stringify(businessContext, null, 2) : 'Nenhum dado disponível'}

SUAS RESPONSABILIDADES:
- Analisar custos e precificação
- Sugerir otimizações de margem de lucro
- Identificar produtos com baixa rentabilidade
- Recomendar estratégias de precificação
- Ajudar a reduzir desperdícios
- Sugerir combos e upselling
- Auxiliar no controle de custos fixos

ESTILO DE COMUNICAÇÃO:
- Seja direto e prático
- Use dados concretos quando disponíveis
- Forneça recomendações acionáveis
- Seja amigável mas profissional
- Responda em português do Brasil

Analise os dados fornecidos e responda à pergunta do usuário de forma útil e baseada em dados.`;

        // Build messages array
        const messages: any[] = [
            { role: 'system', content: systemPrompt }
        ];

        // Add conversation history if provided
        if (conversationHistory && Array.isArray(conversationHistory)) {
            messages.push(...conversationHistory);
        }

        // Add current message
        messages.push({ role: 'user', content: message });

        // Call OpenAI API
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages,
            temperature: 0.7,
            max_tokens: 800,
        });

        const aiMessage = completion.choices[0]?.message?.content || 'Desculpe, não consegui processar sua mensagem.';

        return NextResponse.json({
            success: true,
            message: aiMessage
        });

    } catch (error: any) {
        console.error('Error in chat AI:', error);
        return NextResponse.json(
            {
                error: 'Failed to get AI response',
                details: error.message
            },
            { status: 500 }
        );
    }
}
