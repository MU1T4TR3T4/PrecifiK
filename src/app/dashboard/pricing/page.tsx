'use client';

import { useState } from 'react';
import { useProducts } from '@/contexts/ProductContext';
import PricingCalculator from '@/components/PricingCalculator';

export default function PricingPage() {
    const { products } = useProducts();
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

    return (
        <div>
            <h1 style={{ marginBottom: '1.5rem' }}>Motor de Precificação</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', alignItems: 'start' }}>
                <div className="card">
                    <h3 style={{ marginBottom: '1rem' }}>Selecione um Produto</h3>
                    {products.length === 0 ? (
                        <p>Nenhum produto cadastrado.</p>
                    ) : (
                        <ul style={{ listStyle: 'none' }}>
                            {products.map(p => (
                                <li key={p.id} style={{ marginBottom: '0.5rem' }}>
                                    <button
                                        onClick={() => setSelectedProductId(p.id)}
                                        style={{
                                            width: '100%',
                                            textAlign: 'left',
                                            padding: '0.75rem',
                                            backgroundColor: selectedProductId === p.id ? 'var(--primary)' : '#f9f9f9',
                                            color: selectedProductId === p.id ? 'white' : 'inherit',
                                            borderRadius: 'var(--radius)',
                                            fontWeight: selectedProductId === p.id ? 'bold' : 'normal'
                                        }}
                                    >
                                        {p.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div>
                    {selectedProductId ? (
                        <div className="card">
                            {(() => {
                                const product = products.find(p => p.id === selectedProductId);
                                if (!product) return null;
                                return <PricingCalculator product={product} />;
                            })()}
                        </div>
                    ) : (
                        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                            <p>Selecione um produto ao lado para ver a análise de preço.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
