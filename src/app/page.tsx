import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <div style={{ position: 'relative', width: '100%', height: '100px', marginBottom: '1rem' }}>
        <Image
          src="/logo/logo precifik.png"
          alt="PrecifiK Logo"
          fill
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>
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
