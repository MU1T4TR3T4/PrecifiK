import IngredientForm from '@/components/IngredientForm';
import IngredientList from '@/components/IngredientList';

export default function IngredientsPage() {
    return (
        <div>
            <h1 style={{ marginBottom: '1.5rem' }}>Gerenciar Insumos</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', alignItems: 'start' }}>
                <IngredientForm />
                <IngredientList />
            </div>
        </div>
    );
}
