import IngredientForm from '@/components/IngredientForm';
import IngredientList from '@/components/IngredientList';

export default function IngredientsPage() {
    return (
        <div>
            <h1 style={{ marginBottom: '1.5rem' }}>Gerenciar Insumos</h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <IngredientForm />
                <IngredientList />
            </div>
        </div>
    );
}
