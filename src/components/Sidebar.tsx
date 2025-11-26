'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Insumos', path: '/dashboard/ingredients' },
    { name: 'Receitas / Produtos', path: '/dashboard/products' },
    { name: 'Custos Fixos', path: '/dashboard/costs' },
    { name: 'Precificação', path: '/dashboard/pricing' },
    { name: 'Integrações', path: '/dashboard/integrations' },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside style={{
            width: '250px',
            backgroundColor: 'white',
            borderRight: '1px solid var(--border)',
            height: '100vh',
            padding: '1.5rem',
            position: 'fixed',
            left: 0,
            top: 0
        }}>
            <h2 style={{ color: 'var(--primary)', marginBottom: '2rem' }}>PrecifiK</h2>
            <nav>
                <ul style={{ listStyle: 'none' }}>
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <li key={item.path} style={{ marginBottom: '0.5rem' }}>
                                <Link href={item.path} style={{
                                    display: 'block',
                                    padding: '0.75rem 1rem',
                                    borderRadius: 'var(--radius)',
                                    backgroundColor: isActive ? '#FFF0F1' : 'transparent',
                                    color: isActive ? 'var(--primary)' : 'var(--text-main)',
                                    fontWeight: isActive ? '600' : '400',
                                    transition: 'background-color 0.2s'
                                }}>
                                    {item.name}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
}
