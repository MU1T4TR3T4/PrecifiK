'use client';

import { useState } from 'react';
import { useFixedCosts } from '@/contexts/FixedCostContext';

export default function FixedCostsPage() {
    const {
        fixedCosts,
        addFixedCost,
        removeFixedCost,
        totalFixedCost,
        estimatedMonthlySales,
        setEstimatedMonthlySales,
        costPerSale
    } = useFixedCosts();

    const [name, setName] = useState('');
    const [value, setValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !value) return;

        addFixedCost({
            name,
            value: Number(value),
        });

        setName('');
        setValue('');
    };

    return (
        <div>
            <h1 style={{ marginBottom: '1.5rem' }}>Custos Fixos Mensais</h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                <div className="card">
                    <h3 style={{ marginBottom: '1rem' }}>Adicionar Despesa</h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nome da Despesa</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input-field"
                                placeholder="Ex: Aluguel, Luz, Internet"
                            />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Valor Mensal (R$)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                className="input-field"
                                placeholder="Ex: 1500.00"
                            />
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                            Adicionar
                        </button>
                    </form>
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: '1rem' }}>Resumo Financeiro</h3>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                            Estimativa de Vendas Mensais (Pedidos/Unidades)
                        </label>
                        <input
                            type="number"
                            value={estimatedMonthlySales}
                            onChange={(e) => setEstimatedMonthlySales(Number(e.target.value))}
                            className="input-field"
                        />
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            Usado para diluir os custos fixos em cada produto vendido.
                        </p>
                    </div>

                    <div style={{ padding: '1rem', backgroundColor: '#FFF0F1', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span>Total Custos Fixos:</span>
                            <strong>R$ {totalFixedCost.toFixed(2)}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', color: 'var(--primary)' }}>
                            <span>Custo Fixo por Venda:</span>
                            <strong>R$ {costPerSale.toFixed(2)}</strong>
                        </div>
                    </div>
                </div>

            </div>

            <div className="card" style={{ marginTop: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Lista de Despesas</h3>
                {fixedCosts.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)' }}>Nenhuma despesa cadastrada.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '0.75rem' }}>Despesa</th>
                                <th style={{ padding: '0.75rem' }}>Valor</th>
                                <th style={{ padding: '0.75rem' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fixedCosts.map((cost) => (
                                <tr key={cost.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '0.75rem' }}>{cost.name}</td>
                                    <td style={{ padding: '0.75rem' }}>R$ {cost.value.toFixed(2)}</td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <button
                                            onClick={() => removeFixedCost(cost.id)}
                                            style={{ color: 'red', fontWeight: 'bold' }}
                                        >
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
