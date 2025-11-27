'use client';

import { useState, useEffect } from 'react';
import { useFixedCosts } from '@/contexts/FixedCostContext';
import { useIngredients } from '@/contexts/IngredientContext';

export default function PricingCalculator({ product }: { product: any }) {
    const { costPerSale } = useFixedCosts();
    const { ingredients } = useIngredients();

    const [taxRate, setTaxRate] = useState(4); // Simples Nacional default
    const [cardFee, setCardFee] = useState(2); // 2% default
    const [deliveryFee, setDeliveryFee] = useState(0); // 0% default
    const [desiredProfit, setDesiredProfit] = useState(product.profitMargin || 20);

    // AI states
    const [isLoadingAI, setIsLoadingAI] = useState(false);
    const [aiResponse, setAiResponse] = useState<any>(null);
    const [showAIModal, setShowAIModal] = useState(false);
    const [aiError, setAiError] = useState<string | null>(null);

    // Calculate Variable Cost
    let variableCost = 0;
    product.ingredients.forEach((item: any) => {
        const ing = ingredients.find(i => i.id === item.ingredientId);
        if (ing) {
            variableCost += ing.pricePerBaseUnit * item.quantityUsed;
        }
    });
    variableCost += product.laborCost || 0;
    variableCost += product.packagingCost || 0;

    // Pricing Logic
    const totalDeductions = (taxRate + cardFee + deliveryFee + desiredProfit) / 100;
    const divisor = 1 - totalDeductions;
    const recommendedPrice = divisor > 0 ? (variableCost + costPerSale) / divisor : 0;

    const breakEvenDivisor = 1 - ((taxRate + cardFee + deliveryFee) / 100);
    const breakEvenPrice = breakEvenDivisor > 0 ? (variableCost + costPerSale) / breakEvenDivisor : 0;

    // AI Analysis Function
    const handleAIAnalysis = async () => {
        setIsLoadingAI(true);
        setAiError(null);

        try {
            const response = await fetch('/api/ai/pricing', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productName: product.name,
                    variableCost,
                    fixedCost: costPerSale,
                    taxRate,
                    cardFee,
                    deliveryFee,
                    desiredProfit,
                    recommendedPrice
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao obter análise da IA');
            }

            setAiResponse(data.data);
            setShowAIModal(true);
        } catch (error: any) {
            console.error('AI Analysis Error:', error);
            setAiError(error.message || 'Erro ao conectar com a IA. Tente novamente.');
        } finally {
            setIsLoadingAI(false);
        }
    };

    return (
        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
            <h4 style={{ marginBottom: '1rem' }}>Análise de Precificação: {product.name}</h4>

            <div className="form-grid-2" style={{ marginBottom: '1rem' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '0.9rem' }}>Impostos (%)</label>
                    <input type="number" value={taxRate} onChange={e => setTaxRate(Number(e.target.value))} className="input-field" />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.9rem' }}>Taxa Cartão (%)</label>
                    <input type="number" value={cardFee} onChange={e => setCardFee(Number(e.target.value))} className="input-field" />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.9rem' }}>Taxa Delivery (%)</label>
                    <input type="number" value={deliveryFee} onChange={e => setDeliveryFee(Number(e.target.value))} className="input-field" />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.9rem' }}>Lucro Desejado (%)</label>
                    <input type="number" value={desiredProfit} onChange={e => setDesiredProfit(Number(e.target.value))} className="input-field" />
                </div>
            </div>

            <div style={{ display: 'grid', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Custo Variável:</span>
                    <span>R$ {variableCost.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Custo Fixo (Rateio):</span>
                    <span>R$ {costPerSale.toFixed(2)}</span>
                </div>
                <hr style={{ borderColor: '#ccc' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d32f2f' }}>
                    <span>Preço Mínimo (Zero Lucro):</span>
                    <strong>R$ {breakEvenPrice.toFixed(2)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary)', fontSize: '1.2rem' }}>
                    <span>Preço Recomendado:</span>
                    <strong>R$ {recommendedPrice.toFixed(2)}</strong>
                </div>
            </div>

            <div style={{ marginTop: '1.5rem', borderTop: '1px solid #ddd', paddingTop: '1rem' }}>
                <button
                    className="btn-primary"
                    style={{
                        width: '100%',
                        background: isLoadingAI ? '#ccc' : 'linear-gradient(45deg, #EA1D2C, #ff4b59)',
                        cursor: isLoadingAI ? 'not-allowed' : 'pointer'
                    }}
                    onClick={handleAIAnalysis}
                    disabled={isLoadingAI}
                >
                    {isLoadingAI ? '🔄 Analisando...' : '✨ Calcular Melhor Preço (IA)'}
                </button>
                <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem', textAlign: 'center' }}>
                    Baseado em análise de concorrentes e comportamento de compra.
                </p>
                {aiError && (
                    <p style={{ fontSize: '0.9rem', color: '#d32f2f', marginTop: '0.5rem', textAlign: 'center' }}>
                        ⚠️ {aiError}
                    </p>
                )}
            </div>

            {/* AI Response Modal */}
            {showAIModal && aiResponse && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    padding: '1rem'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '2rem',
                        maxWidth: '500px',
                        width: '100%',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                    }}>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>✨ Análise da IA</h3>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{
                                padding: '1rem',
                                backgroundColor: '#e6f7ff',
                                borderRadius: '8px',
                                marginBottom: '1rem'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: 'bold' }}>Preço Sugerido pela IA:</span>
                                    <span style={{ fontSize: '1.3rem', color: 'var(--primary)', fontWeight: 'bold' }}>
                                        R$ {Number(aiResponse.precoSugerido).toFixed(2)}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontWeight: 'bold' }}>Probabilidade de Venda:</span>
                                    <span style={{
                                        fontWeight: 'bold',
                                        color: aiResponse.probabilidadeVenda === 'Alta' ? '#52c41a' :
                                            aiResponse.probabilidadeVenda === 'Média' ? '#faad14' : '#f5222d'
                                    }}>
                                        {aiResponse.probabilidadeVenda}
                                    </span>
                                </div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <strong>Análise:</strong>
                                <p style={{ marginTop: '0.5rem', color: '#666' }}>{aiResponse.analise}</p>
                            </div>

                            <div>
                                <strong>💡 Sugestão Estratégica:</strong>
                                <p style={{ marginTop: '0.5rem', color: '#666' }}>{aiResponse.sugestaoEstrategica}</p>
                            </div>
                        </div>

                        <button
                            className="btn-primary"
                            style={{ width: '100%' }}
                            onClick={() => setShowAIModal(false)}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
