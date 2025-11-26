'use client';

import { useState } from 'react';
import { useIngredients } from '@/contexts/IngredientContext';

export default function IngredientForm() {
    const { addIngredient } = useIngredients();
    const [name, setName] = useState('');
    const [unit, setUnit] = useState<'kg' | 'l' | 'un'>('kg');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !quantity || !price) return;

        addIngredient({
            name,
            unit,
            quantity: Number(quantity),
            price: Number(price),
        });

        setName('');
        setQuantity('');
        setPrice('');
    };

    return (
        <form onSubmit={handleSubmit} className="card">
            <h3 style={{ marginBottom: '1rem' }}>Novo Insumo</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nome</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input-field"
                        placeholder="Ex: Frango, Leite, Pão"
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Unidade de Compra</label>
                        <select
                            value={unit}
                            onChange={(e) => setUnit(e.target.value as any)}
                            className="input-field"
                        >
                            <option value="kg">Quilo (kg)</option>
                            <option value="l">Litro (l)</option>
                            <option value="un">Unidade (un)</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Quantidade Comprada</label>
                        <input
                            type="number"
                            step="0.01"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="input-field"
                            placeholder="Ex: 5"
                        />
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Preço Pago (R$)</label>
                    <input
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="input-field"
                        placeholder="Ex: 32.00"
                    />
                </div>

                <button type="submit" className="btn-primary">
                    Adicionar Insumo
                </button>
            </div>
        </form>
    );
}
