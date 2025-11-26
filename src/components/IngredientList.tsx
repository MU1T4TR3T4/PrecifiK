'use client';

import { useIngredients } from '@/contexts/IngredientContext';

export default function IngredientList() {
    const { ingredients, removeIngredient } = useIngredients();

    if (ingredients.length === 0) {
        return (
            <div className="card" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                <p>Nenhum insumo cadastrado.</p>
            </div>
        );
    }

    return (
        <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Insumos Cadastrados</h3>

            {/* Desktop Table View */}
            <div style={{ overflowX: 'auto' }}>
                <table className="desktop-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '0.75rem' }}>Nome</th>
                            <th style={{ padding: '0.75rem' }}>Compra</th>
                            <th style={{ padding: '0.75rem' }}>Preço Pago</th>
                            <th style={{ padding: '0.75rem' }}>Custo Base</th>
                            <th style={{ padding: '0.75rem' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ingredients.map((ing) => {
                            let baseUnit = 'g';
                            if (ing.unit === 'l') baseUnit = 'ml';
                            if (ing.unit === 'un') baseUnit = 'un';

                            return (
                                <tr key={ing.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '0.75rem' }}>{ing.name}</td>
                                    <td style={{ padding: '0.75rem' }}>{ing.quantity} {ing.unit}</td>
                                    <td style={{ padding: '0.75rem' }}>R$ {ing.price.toFixed(2)}</td>
                                    <td style={{ padding: '0.75rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                                        R$ {ing.pricePerBaseUnit.toFixed(4)} / {baseUnit}
                                    </td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <button
                                            onClick={() => removeIngredient(ing.id)}
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
                {ingredients.map((ing) => {
                    let baseUnit = 'g';
                    if (ing.unit === 'l') baseUnit = 'ml';
                    if (ing.unit === 'un') baseUnit = 'un';

                    return (
                        <div key={ing.id} className="mobile-card-item">
                            <div className="mobile-card-row">
                                <span className="mobile-card-label">Nome</span>
                                <span className="mobile-card-value">{ing.name}</span>
                            </div>
                            <div className="mobile-card-row">
                                <span className="mobile-card-label">Compra</span>
                                <span className="mobile-card-value">{ing.quantity} {ing.unit}</span>
                            </div>
                            <div className="mobile-card-row">
                                <span className="mobile-card-label">Preço Pago</span>
                                <span className="mobile-card-value">R$ {ing.price.toFixed(2)}</span>
                            </div>
                            <div className="mobile-card-row">
                                <span className="mobile-card-label">Custo Base</span>
                                <span className="mobile-card-value" style={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                                    R$ {ing.pricePerBaseUnit.toFixed(4)} / {baseUnit}
                                </span>
                            </div>
                            <div className="mobile-card-row">
                                <button
                                    onClick={() => removeIngredient(ing.id)}
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
