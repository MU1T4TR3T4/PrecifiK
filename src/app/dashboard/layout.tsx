import Sidebar from '@/components/Sidebar';
import AIAssistantChat from '@/components/AIAssistantChat';
import { IngredientProvider } from '@/contexts/IngredientContext';
import { ProductProvider } from '@/contexts/ProductContext';
import { FixedCostProvider } from '@/contexts/FixedCostContext';


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <IngredientProvider>
            <ProductProvider>
                <FixedCostProvider>
                    <div style={{ display: 'flex' }}>
                        <Sidebar />
                        <main style={{
                            marginLeft: '250px',
                            padding: '2rem',
                            width: 'calc(100% - 250px)',
                            minHeight: '100vh'
                        }}
                            className="dashboard-main">
                            {children}
                        </main>
                    </div>
                    {/* AI Assistant Chat - Available on all pages */}
                    <AIAssistantChat />
                </FixedCostProvider>
            </ProductProvider>
        </IngredientProvider>
    );
}
