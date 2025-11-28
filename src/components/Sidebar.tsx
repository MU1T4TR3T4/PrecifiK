'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

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
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile screen size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
            // Close sidebar when switching to desktop
            if (window.innerWidth >= 768) {
                setIsOpen(false);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Close sidebar when route changes on mobile
    useEffect(() => {
        if (isMobile) {
            setIsOpen(false);
        }
    }, [pathname, isMobile]);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* Hamburger Menu Button - Only visible on mobile */}
            {isMobile && (
                <button
                    onClick={toggleSidebar}
                    style={{
                        position: 'fixed',
                        top: '1rem',
                        left: '1rem',
                        zIndex: 1001,
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 'var(--radius)',
                        padding: '0.75rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '48px',
                        height: '48px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        transition: 'transform 0.2s'
                    }}
                    onMouseDown={(e) => {
                        e.currentTarget.style.transform = 'scale(0.95)';
                    }}
                    onMouseUp={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                    aria-label="Toggle menu"
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>
            )}

            {/* Overlay - Only visible on mobile when sidebar is open */}
            {isMobile && isOpen && (
                <div
                    onClick={toggleSidebar}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 999,
                        animation: 'fadeIn 0.3s ease-in-out'
                    }}
                />
            )}

            {/* Sidebar */}
            <aside style={{
                width: '250px',
                backgroundColor: 'white',
                borderRight: '1px solid var(--border)',
                height: '100vh',
                padding: '1.5rem',
                position: 'fixed',
                left: isMobile ? (isOpen ? '0' : '-250px') : '0',
                top: 0,
                zIndex: 1000,
                transition: 'left 0.3s ease-in-out',
                overflowY: 'auto',
                boxShadow: isMobile && isOpen ? '2px 0 8px rgba(0,0,0,0.15)' : 'none'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem'
                }}>
                    <div style={{ position: 'relative', width: '100%', height: '60px' }}>
                        <Image
                            src="/logo/logo precifik.png"
                            alt="PrecifiK Logo"
                            fill
                            style={{ objectFit: 'contain', objectPosition: 'left' }}
                            priority
                        />
                    </div>

                    {/* Close button - Only visible on mobile */}
                    {isMobile && (
                        <button
                            onClick={toggleSidebar}
                            style={{
                                backgroundColor: 'transparent',
                                border: 'none',
                                color: 'var(--text-main)',
                                cursor: 'pointer',
                                padding: '0.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 'var(--radius)',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#f0f0f0';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                            aria-label="Close menu"
                        >
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    )}
                </div>

                <nav>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
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
                                        transition: 'background-color 0.2s',
                                        textDecoration: 'none'
                                    }}>
                                        {item.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </aside>

            {/* Add fadeIn animation */}
            <style jsx global>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
            `}</style>
        </>
    );
}
