'use client';

import { useProducts } from '@/contexts/ProductContext';
import { useIngredients } from '@/contexts/IngredientContext';

export default function ProductList() {
    const { products, removeProduct } = useProducts();
    const { ingredients } = useIngredients();

    const calculateCost = (product: any) => {
        let total = 0;
        product.ingredients.forEach((item: any) => {
            const ing = ingredients.find(i => i.id === item.ingredientId);
            if (ing) {
                total += ing.pricePerBaseUnit * item.quantityUsed;
            }
        });
        total += product.laborCost || 0;
        total += product.packagingCost || 0;
        return total;
    };

    if (products.length === 0) {
        return (
            <div className="card" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                <p>Nenhum produto cadastrado.</p>
            </div>
        );
    }

    return (
        <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Seus Produtos</h3>

            {/* Desktop Table View */}
            <div style={{ overflowX: 'auto' }}>
                <table className="desktop-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '0.75rem' }}>Nome</th>
                            <th style={{ padding: '0.75rem' }}>Custo Total</th>
                            <th style={{ padding: '0.75rem' }}>Margem</th>
                            <th style={{ padding: '0.75rem' }}>Preço Sugerido</th>
                            <th style={{ padding: '0.75rem' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => {
                            const cost = calculateCost(product);
                            const suggested = cost * (1 + (product.profitMargin / 100));

                            return (
                                <tr key={product.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '0.75rem' }}>{product.name}</td>
                                    <td style={{ padding: '0.75rem' }}>R$ {cost.toFixed(2)}</td>
                                    <td style={{ padding: '0.75rem' }}>{product.profitMargin}%</td>
                                    <td style={{ padding: '0.75rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                                        R$ {suggested.toFixed(2)}
                                    </td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <button
                                            onClick={() => removeProduct(product.id)}
                                            style={{ color: 'red', fontWeight: 'bold' }}
                                        >
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="mobile-card-list">
                {products.map((product) => {
                    const cost = calculateCost(product);
                    const suggested = cost * (1 + (product.profitMargin / 100));

                    return (
                        <div key={product.id} className="mobile-card-item">
                            <div className="mobile-card-row">
                                <span className="mobile-card-label">Nome</span>
                                <span className="mobile-card-value">{product.name}</span>
                            </div>
                            <div className="mobile-card-row">
                                <span className="mobile-card-label">Custo Total</span>
                                <span className="mobile-card-value">R$ {cost.toFixed(2)}</span>
                            </div>
                            <div className="mobile-card-row">
                                <span className="mobile-card-label">Margem</span>
                                <span className="mobile-card-value">{product.profitMargin}%</span>
                            </div>
                            <div className="mobile-card-row">
                                <span className="mobile-card-label">Preço Sugerido</span>
                                <span className="mobile-card-value" style={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                                    R$ {suggested.toFixed(2)}
                                </span>
                            </div>
                            <div className="mobile-card-row">
                                <button
                                    onClick={() => removeProduct(product.id)}
                                    className="btn-primary"
                                    style={{ width: '100%', marginTop: '0.5rem', backgroundColor: '#dc3545' }}
                                >
                                    Excluir
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
