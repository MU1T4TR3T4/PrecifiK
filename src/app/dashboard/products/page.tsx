import ProductBuilder from '@/components/ProductBuilder';
import ProductList from '@/components/ProductList';

export default function ProductsPage() {
    return (
        <div>
            <h1 style={{ marginBottom: '1.5rem' }}>Receitas e Produtos</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
                <ProductBuilder />
                <ProductList />
            </div>
        </div>
    );
}
