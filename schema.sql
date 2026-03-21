-- Habilitar a extensão para gerar UUIDs se ainda não existir
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar a tabela 'products'
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  sku TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Configurar o esquema do RLS (Row Level Security)
-- Como é um app cliente direto sem autenticação por enquanto, vamos liberar as policies de acesso anônimo:
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura para todos" 
ON products FOR SELECT USING (true);

CREATE POLICY "Permitir inserção para todos" 
ON products FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir atualização para todos" 
ON products FOR UPDATE USING (true);

CREATE POLICY "Permitir exclusão para todos" 
ON products FOR DELETE USING (true);
