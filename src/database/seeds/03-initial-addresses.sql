-- Sample addresses for testing
-- Note: These addresses are linked to existing customers from 02-initial-customers.sql
-- Customer IDs: 1=João Silva, 2=Maria Santos, 3=Pedro Oliveira, 4=Ana Costa, 5=Carlos Ferreira

-- Insert sample addresses for João Silva (customer_id: 01JQZ8K9M2N3P4Q5R6S7T8U9V0)
INSERT INTO addresses (customer_id, street, number, complement, neighborhood, city, state, postal_code, country, is_primary) 
VALUES 
('01JQZ8K9M2N3P4Q5R6S7T8U9V0', 'Rua das Flores', '123', 'Apto 45', 'Centro', 'São Paulo', 'SP', '01234-567', 'Brasil', true),
('01JQZ8K9M2N3P4Q5R6S7T8U9V0', 'Av. Paulista', '1000', 'Sala 101', 'Bela Vista', 'São Paulo', 'SP', '01310-100', 'Brasil', false);

-- Insert sample addresses for Maria Santos (customer_id: 01JQZ8K9M2N3P4Q5R6S7T8U9V1)
INSERT INTO addresses (customer_id, street, number, complement, neighborhood, city, state, postal_code, country, is_primary) 
VALUES 
('01JQZ8K9M2N3P4Q5R6S7T8U9V1', 'Rua Augusta', '456', NULL, 'Consolação', 'São Paulo', 'SP', '01305-000', 'Brasil', true),
('01JQZ8K9M2N3P4Q5R6S7T8U9V1', 'Rua das Palmeiras', '789', 'Casa 2', 'Copacabana', 'Rio de Janeiro', 'RJ', '22000-000', 'Brasil', false);

-- Insert sample addresses for Pedro Oliveira (customer_id: 01JQZ8K9M2N3P4Q5R6S7T8U9V2)
INSERT INTO addresses (customer_id, street, number, complement, neighborhood, city, state, postal_code, country, is_primary) 
VALUES 
('01JQZ8K9M2N3P4Q5R6S7T8U9V2', 'Rua Oscar Freire', '789', 'Loja 12', 'Jardins', 'São Paulo', 'SP', '01426-001', 'Brasil', true),
('01JQZ8K9M2N3P4Q5R6S7T8U9V2', 'Av. Faria Lima', '2000', 'Torre A, 15º andar', 'Itaim Bibi', 'São Paulo', 'SP', '04538-132', 'Brasil', false),
('01JQZ8K9M2N3P4Q5R6S7T8U9V2', 'Avenida Central', '456', 'Sala 15', 'Savassi', 'Belo Horizonte', 'MG', '30000-000', 'Brasil', false);

-- Insert sample addresses for Ana Costa (customer_id: 01JQZ8K9M2N3P4Q5R6S7T8U9V3)
INSERT INTO addresses (customer_id, street, number, complement, neighborhood, city, state, postal_code, country, is_primary) 
VALUES 
('01JQZ8K9M2N3P4Q5R6S7T8U9V3', 'Rua da Praia', '321', 'Apto 201', 'Ipanema', 'Rio de Janeiro', 'RJ', '22400-000', 'Brasil', true),
('01JQZ8K9M2N3P4Q5R6S7T8U9V3', 'Av. Atlântica', '1000', 'Cobertura', 'Copacabana', 'Rio de Janeiro', 'RJ', '22010-000', 'Brasil', false);

-- Insert sample addresses for Carlos Ferreira (customer_id: 01JQZ8K9M2N3P4Q5R6S7T8U9V4)
INSERT INTO addresses (customer_id, street, number, complement, neighborhood, city, state, postal_code, country, is_primary) 
VALUES 
('01JQZ8K9M2N3P4Q5R6S7T8U9V4', 'Rua da Liberdade', '654', NULL, 'Centro', 'Porto Alegre', 'RS', '90000-000', 'Brasil', true),
('01JQZ8K9M2N3P4Q5R6S7T8U9V4', 'Av. Ipiranga', '2000', 'Sala 50', 'Centro Histórico', 'Porto Alegre', 'RS', '90160-093', 'Brasil', false);
