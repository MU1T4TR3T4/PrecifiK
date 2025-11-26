'use client';

import { useIngredients } from '@/contexts/IngredientContext';
import { useProducts } from '@/contexts/ProductContext';
import { useFixedCosts } from '@/contexts/FixedCostContext';

export default function DashboardPage() {
    const { ingredients } = useIngredients();
    const { products } = useProducts();
    const { totalFixedCost, estimatedMonthlySales } = useFixedCosts();

    // Calculate estimated profit
    // Profit = (Avg Price - Avg Cost) * Sales - Fixed Costs
    // This is a rough estimate based on averages

    let totalProductCost = 0;
    let totalProductPrice = 0;

    products.forEach(p => {
        // Calculate cost for this product
        let cost = 0;
        p.ingredients.forEach((item: any) => {
            const ing = ingredients.find(i => i.id === item.ingredientId);
            if (ing) cost += ing.pricePerBaseUnit * item.quantityUsed;
        });
        cost += p.laborCost || 0;
        cost += p.packagingCost || 0;

        totalProductCost += cost;
        totalProductPrice += cost * (1 + (p.profitMargin / 100));
    });

    const avgCost = products.length > 0 ? totalProductCost / products.length : 0;
    const avgPrice = products.length > 0 ? totalProductPrice / products.length : 0;

    const estimatedRevenue = avgPrice * estimatedMonthlySales;
    const estimatedVariableCost = avgCost * estimatedMonthlySales;
    const estimatedProfit = estimatedRevenue - estimatedVariableCost - totalFixedCost;

    return (
        <div>
            <h1 style={{ marginBottom: '1.5rem' }}>Visão Geral do Negócio</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <div className="card">
                    <h3>Produtos Cadastrados</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{products.length}</p>
                </div>
                <div className="card">
                    <h3>Insumos</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{ingredients.length}</p>
                </div>
                <div className="card">
                    <h3>Lucro Estimado (Mês)</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: estimatedProfit >= 0 ? 'green' : 'red' }}>
                        R$ {estimatedProfit.toFixed(2)}
                    </p>
                    <small style={{ color: 'var(--text-secondary)' }}>Baseado em {estimatedMonthlySales} vendas/mês</small>
                </div>
                <div className="card">
                    <h3>Custo Fixo Total</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#d32f2f' }}>R$ {totalFixedCost.toFixed(2)}</p>
                </div>
            </div>

            <div className="card" style={{ marginTop: '2rem' }}>
                <h3>Ações Rápidas</h3>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button className="btn-primary" onClick={() => window.location.href = '/dashboard/products'}>
                        Criar Novo Produto
                    </button>
                    <button className="btn-primary" style={{ backgroundColor: '#333' }} onClick={() => window.location.href = '/dashboard/pricing'}>
                        Analisar Preços
                    </button>
                </div>
            </div>
        </div>
    );
}
