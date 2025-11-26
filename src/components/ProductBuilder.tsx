'use client';

import { useState } from 'react';
import { useIngredients } from '@/contexts/IngredientContext';
import { useProducts, ProductIngredient } from '@/contexts/ProductContext';

export default function ProductBuilder() {
    const { ingredients } = useIngredients();
    const { addProduct } = useProducts();

    const [name, setName] = useState('');
    const [selectedIngredients, setSelectedIngredients] = useState<ProductIngredient[]>([]);
    const [currentIngredientId, setCurrentIngredientId] = useState('');
    const [currentQuantity, setCurrentQuantity] = useState('');

    const [laborCost, setLaborCost] = useState('');
    const [packagingCost, setPackagingCost] = useState('');
    const [profitMargin, setProfitMargin] = useState('');

    const handleAddIngredient = () => {
        if (!currentIngredientId || !currentQuantity) return;

        setSelectedIngredients(prev => [
            ...prev,
            { ingredientId: currentIngredientId, quantityUsed: Number(currentQuantity) }
        ]);

        setCurrentIngredientId('');
        setCurrentQuantity('');
    };

    const removeIngredient = (index: number) => {
        setSelectedIngredients(prev => prev.filter((_, i) => i !== index));
    };

    const calculateTotalCost = () => {
        let total = 0;
        selectedIngredients.forEach(item => {
            const ing = ingredients.find(i => i.id === item.ingredientId);
            if (ing) {
                total += ing.pricePerBaseUnit * item.quantityUsed;
            }
        });
        total += Number(laborCost || 0);
        total += Number(packagingCost || 0);
        return total;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || selectedIngredients.length === 0) return;

        addProduct({
            name,
            ingredients: selectedIngredients,
            laborCost: Number(laborCost),
            packagingCost: Number(packagingCost),
            profitMargin: Number(profitMargin),
        });

        // Reset form
        setName('');
        setSelectedIngredients([]);
        setLaborCost('');
        setPackagingCost('');
        setProfitMargin('');
    };

    const totalCost = calculateTotalCost();
    const suggestedPrice = totalCost * (1 + (Number(profitMargin) / 100));

    return (
        <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Criar Receita / Produto</h3>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nome do Produto</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                    placeholder="Ex: X-Bacon"
                />
            </div>

            <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>Adicionar Insumos</h4>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    <select
                        value={currentIngredientId}
                        onChange={(e) => setCurrentIngredientId(e.target.value)}
                        className="input-field"
                        style={{ marginBottom: 0, flex: '1 1 200px', minWidth: '150px' }}
                    >
                        <option value="">Selecione um insumo...</option>
                        {ingredients.map(ing => (
                            <option key={ing.id} value={ing.id}>{ing.name} ({ing.unit})</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        value={currentQuantity}
                        onChange={(e) => setCurrentQuantity(e.target.value)}
                        className="input-field"
                        placeholder="Qtd (g/ml/un)"
                        style={{ marginBottom: 0, flex: '0 1 150px', minWidth: '100px' }}
                    />
                    <button type="button" onClick={handleAddIngredient} className="btn-primary" style={{ flex: '0 0 auto' }}>
                        +
                    </button>
                </div>

                {selectedIngredients.length > 0 && (
                    <ul style={{ listStyle: 'none', marginBottom: '1rem' }}>
                        {selectedIngredients.map((item, index) => {
                            const ing = ingredients.find(i => i.id === item.ingredientId);
                            const cost = ing ? ing.pricePerBaseUnit * item.quantityUsed : 0;
                            return (
                                <li key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px dashed #ccc' }}>
                                    <span>{ing?.name} ({item.quantityUsed} {ing?.unit === 'l' ? 'ml' : ing?.unit === 'kg' ? 'g' : 'un'})</span>
                                    <span>R$ {cost.toFixed(2)} <button onClick={() => removeIngredient(index)} style={{ color: 'red', marginLeft: '0.5rem' }}>x</button></span>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            <div className="form-grid-2">
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Custo Mão de Obra (R$)</label>
                    <input
                        type="number"
                        value={laborCost}
                        onChange={(e) => setLaborCost(e.target.value)}
                        className="input-field"
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Custo Embalagem (R$)</label>
                    <input
                        type="number"
                        value={packagingCost}
                        onChange={(e) => setPackagingCost(e.target.value)}
                        className="input-field"
                    />
                </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Margem de Lucro Desejada (%)</label>
                <input
                    type="number"
                    value={profitMargin}
                    onChange={(e) => setProfitMargin(e.target.value)}
                    className="input-field"
                />
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#e6f7ff', borderRadius: '8px', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>Custo Total:</span>
                    <strong>R$ {totalCost.toFixed(2)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', color: 'var(--primary)' }}>
                    <span>Preço Sugerido:</span>
                    <strong>R$ {suggestedPrice.toFixed(2)}</strong>
                </div>
            </div>

            <button onClick={handleSubmit} className="btn-primary" style={{ width: '100%' }}>
                Salvar Produto
            </button>
        </div>
    );
}
