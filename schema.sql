-- Habilitar a extensão para gerar UUIDs se ainda não existir
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar a tabela 'products' se não existir
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  sku TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Configurar o esquema do RLS (Row Level Security)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Removemos políticas antigas para não dar conflito se você rodar por cima
DROP POLICY IF EXISTS "Permitir leitura para todos" ON products;
DROP POLICY IF EXISTS "Permitir inserção para todos" ON products;
DROP POLICY IF EXISTS "Permitir atualização para todos" ON products;
DROP POLICY IF EXISTS "Permitir exclusão para todos" ON products;
DROP POLICY IF EXISTS "Permitir leitura para logados" ON products;
DROP POLICY IF EXISTS "Permitir inserção para logados" ON products;
DROP POLICY IF EXISTS "Permitir atualização para logados" ON products;
DROP POLICY IF EXISTS "Permitir exclusão para logados" ON products;

-- Criação das políticas PERMISSIVAS para funcionar com o login local 'admin' (anon)
CREATE POLICY "Permitir leitura para todos" 
ON products FOR SELECT USING (true);

CREATE POLICY "Permitir inserção para todos" 
ON products FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir atualização para todos" 
ON products FOR UPDATE USING (true);

CREATE POLICY "Permitir exclusão para todos" 
ON products FOR DELETE USING (true);
