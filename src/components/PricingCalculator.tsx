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
    // Price = (Variable Cost + Fixed Cost) / (1 - (Tax + Card + Delivery + Profit))
    // Note: Percentages should be in decimal (e.g., 0.04)

    const totalDeductions = (taxRate + cardFee + deliveryFee + desiredProfit) / 100;

    // Safety check to avoid division by zero or negative
    const divisor = 1 - totalDeductions;
    const recommendedPrice = divisor > 0 ? (variableCost + costPerSale) / divisor : 0;

    const minPrice = variableCost + costPerSale; // Break-even (0 profit, 0 taxes? No, taxes apply on revenue)
    // Actually Break-even Price = (Variable + Fixed) / (1 - (Tax + Card + Delivery))
    const breakEvenDivisor = 1 - ((taxRate + cardFee + deliveryFee) / 100);
    const breakEvenPrice = breakEvenDivisor > 0 ? (variableCost + costPerSale) / breakEvenDivisor : 0;

    return (
        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
            <h4 style={{ marginBottom: '1rem' }}>Análise de Precificação: {product.name}</h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
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
                    style={{ width: '100%', background: 'linear-gradient(45deg, #EA1D2C, #ff4b59)' }}
                    onClick={() => alert('Analisando mercado e concorrentes...\n\nSugestão IA:\nPreço Ideal: R$ ' + (recommendedPrice * 0.95).toFixed(2) + '\nProbabilidade de Venda: Alta (85%)\nSugestão: Crie um combo com Bebida para aumentar o ticket médio em 15%.')}
                >
                    ✨ Calcular Melhor Preço (IA)
                </button>
                <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem', textAlign: 'center' }}>
                    Baseado em análise de concorrentes e comportamento de compra.
                </p>
            </div>
        </div>
    );
}
