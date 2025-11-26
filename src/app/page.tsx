import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ color: 'var(--primary)', fontSize: '2.5rem', marginBottom: '1rem' }}>PrecifiK</h1>
      <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
        A ferramenta que todo pequeno restaurante gostaria de ter.
      </p>

      <div className="card">
        <h2 style={{ marginBottom: '1rem' }}>Bem-vindo</h2>
        <p style={{ marginBottom: '1.5rem' }}>Comece cadastrando seus insumos e receitas.</p>
        <Link href="/dashboard">
          <button className="btn-primary">
            Entrar no Sistema
          </button>
        </Link>
      </div>
    </main>
  );
}
