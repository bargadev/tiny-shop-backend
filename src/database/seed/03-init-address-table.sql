-- Initial address data for Tiny Shop Backend
-- This file contains sample addresses for development and testing purposes
-- 
-- Note: These addresses are linked to existing customers from 02-init-customer-table.sql
-- Customer IDs: 01JQZ8K9M2N3P4Q5R6S7T8W9V0=João Silva, 01JQZ8K9M2N3P4Q5R6S7T8W9V1=Maria Santos, etc.
-- 
-- To use this file:
-- 1. Run migrations first: npm run migration:run
-- 2. Execute users seed: psql -h localhost -U postgres -d tiny_shop -f src/database/seed/01-init-user-table.sql
-- 3. Execute customers seed: psql -h localhost -U postgres -d tiny_shop -f src/database/seed/02-init-customer-table.sql
-- 4. Then execute this file: psql -h localhost -U postgres -d tiny_shop -f src/database/seed/03-init-address-table.sql

-- Insert all sample addresses
INSERT INTO address (address_id, customer_id, street, number, complement, neighborhood, city, state, postal_code, country, is_primary) 
VALUES 
-- João Silva (customer_id: 01JQZ8K9M2N3P4Q5R6S7T8W9V0)
('01JQZAA1M2N3P4Q5R6S7T8W9V0', '01JQZ8K9M2N3P4Q5R6S7T8W9V0', 'Rua das Flores', '123', 'Apto 45', 'Centro', 'São Paulo', 'SP', '01234-567', 'Brasil', true),
('01JQZAA2M2N3P4Q5R6S7T8W9V0', '01JQZ8K9M2N3P4Q5R6S7T8W9V0', 'Av. Paulista', '1000', 'Sala 101', 'Bela Vista', 'São Paulo', 'SP', '01310-100', 'Brasil', false),
-- Maria Santos (customer_id: 01JQZ8K9M2N3P4Q5R6S7T8W9V1)
('01JQZAA3M2N3P4Q5R6S7T8W9V1', '01JQZ8K9M2N3P4Q5R6S7T8W9V1', 'Rua Augusta', '456', NULL, 'Consolação', 'São Paulo', 'SP', '01305-000', 'Brasil', true),
('01JQZAA4M2N3P4Q5R6S7T8W9V1', '01JQZ8K9M2N3P4Q5R6S7T8W9V1', 'Rua das Palmeiras', '789', 'Casa 2', 'Copacabana', 'Rio de Janeiro', 'RJ', '22000-000', 'Brasil', false),
-- Pedro Oliveira (customer_id: 01JQZ8K9M2N3P4Q5R6S7T8W9V2)
('01JQZAA5M2N3P4Q5R6S7T8W9V2', '01JQZ8K9M2N3P4Q5R6S7T8W9V2', 'Rua Oscar Freire', '789', 'Loja 12', 'Jardins', 'São Paulo', 'SP', '01426-001', 'Brasil', true),
('01JQZAA6M2N3P4Q5R6S7T8W9V2', '01JQZ8K9M2N3P4Q5R6S7T8W9V2', 'Av. Faria Lima', '2000', 'Torre A, 15º andar', 'Itaim Bibi', 'São Paulo', 'SP', '04538-132', 'Brasil', false),
('01JQZAA7M2N3P4Q5R6S7T8W9V2', '01JQZ8K9M2N3P4Q5R6S7T8W9V2', 'Avenida Central', '456', 'Sala 15', 'Savassi', 'Belo Horizonte', 'MG', '30000-000', 'Brasil', false),
-- Ana Costa (customer_id: 01JQZ8K9M2N3P4Q5R6S7T8W9V3)
('01JQZAA8M2N3P4Q5R6S7T8W9V3', '01JQZ8K9M2N3P4Q5R6S7T8W9V3', 'Rua da Praia', '321', 'Apto 201', 'Ipanema', 'Rio de Janeiro', 'RJ', '22400-000', 'Brasil', true),
('01JQZAA9M2N3P4Q5R6S7T8W9V3', '01JQZ8K9M2N3P4Q5R6S7T8W9V3', 'Av. Atlântica', '1000', 'Cobertura', 'Copacabana', 'Rio de Janeiro', 'RJ', '22010-000', 'Brasil', false),
-- Carlos Ferreira (customer_id: 01JQZ8K9M2N3P4Q5R6S7T8W9V4)
('01JQZAB0M2N3P4Q5R6S7T8W9V4', '01JQZ8K9M2N3P4Q5R6S7T8W9V4', 'Rua da Liberdade', '654', NULL, 'Centro', 'Porto Alegre', 'RS', '90000-000', 'Brasil', true),
('01JQZAB1M2N3P4Q5R6S7T8W9V4', '01JQZ8K9M2N3P4Q5R6S7T8W9V4', 'Av. Ipiranga', '2000', 'Sala 50', 'Centro Histórico', 'Porto Alegre', 'RS', '90160-093', 'Brasil', false);

-- No ON CONFLICT needed since there's no unique constraint on these fields

-- Display inserted addresses count
SELECT 'Successfully inserted ' || COUNT(*) || ' addresses' as result
FROM address 
WHERE customer_id IN (
  '01JQZ8K9M2N3P4Q5R6S7T8W9V0',
  '01JQZ8K9M2N3P4Q5R6S7T8W9V1',
  '01JQZ8K9M2N3P4Q5R6S7T8W9V2',
  '01JQZ8K9M2N3P4Q5R6S7T8W9V3',
  '01JQZ8K9M2N3P4Q5R6S7T8W9V4'
);
