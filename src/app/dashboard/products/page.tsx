import ProductBuilder from '@/components/ProductBuilder';
import ProductList from '@/components/ProductList';

export default function ProductsPage() {
    return (
        <div>
            <h1 style={{ marginBottom: '1.5rem' }}>Receitas e Produtos</h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <ProductBuilder />
                <ProductList />
            </div>
        </div>
    );
}
