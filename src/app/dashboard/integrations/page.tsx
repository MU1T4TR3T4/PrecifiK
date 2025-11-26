export default function IntegrationsPage() {
    const integrations = [
        { name: 'iFood', status: 'Conectado', icon: '🔴' },
        { name: 'Rappi', status: 'Desconectado', icon: '🟠' },
        { name: 'Uber Eats', status: 'Desconectado', icon: '🟢' },
        { name: 'MenuDino', status: 'Desconectado', icon: '🦖' },
    ];

    return (
        <div>
            <h1 style={{ marginBottom: '1.5rem' }}>Integrações</h1>
            <div className="card">
                <h3 style={{ marginBottom: '1rem' }}>Apps de Delivery e PDV</h3>
                <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                    Conecte suas contas para importar vendas e calcular custos reais automaticamente.
                </p>

                <div style={{ display: 'grid', gap: '1rem' }}>
                    {integrations.map((app) => (
                        <div key={app.name} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '1rem',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span style={{ fontSize: '1.5rem' }}>{app.icon}</span>
                                <span style={{ fontWeight: 'bold' }}>{app.name}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span style={{
                                    color: app.status === 'Conectado' ? 'green' : 'gray',
                                    fontWeight: 'bold',
                                    fontSize: '0.9rem'
                                }}>
                                    {app.status}
                                </span>
                                <button className="btn-primary" style={{
                                    backgroundColor: app.status === 'Conectado' ? 'white' : 'var(--primary)',
                                    color: app.status === 'Conectado' ? 'var(--primary)' : 'white',
                                    border: app.status === 'Conectado' ? '1px solid var(--primary)' : 'none',
                                    padding: '0.5rem 1rem'
                                }}>
                                    {app.status === 'Conectado' ? 'Configurar' : 'Conectar'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
