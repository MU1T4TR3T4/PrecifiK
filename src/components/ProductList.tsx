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
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
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
        </div>
    );
}
