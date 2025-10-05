-- Initial customer data for Tiny Shop Backend
-- This file contains sample customers for development and testing purposes
-- 
-- Note: These customers correspond to the users created in 01-init-user-table.sql
-- 
-- To use this file:
-- 1. Run migrations first: npm run migration:run
-- 2. Execute users seed: psql -h localhost -U postgres -d tiny_shop -f src/database/seed/01-init-user-table.sql
-- 3. Then execute this file: psql -h localhost -U postgres -d tiny_shop -f src/database/seed/02-init-customer-table.sql

-- Insert 5 sample customers
INSERT INTO customer (
    customer_id,
    first_name,
    last_name,
    email,
    phone_number,
    date_of_birth
) VALUES 
(
    '01JQZ8K9M2N3P4Q5R6S7T8U9V0',
    'João',
    'Silva',
    'joao.silva@email.com',
    '+55 11 99999-9999',
    '1990-05-15'
),
(
    '01JQZ8K9M2N3P4Q5R6S7T8U9V1',
    'Maria',
    'Santos',
    'maria.santos@email.com',
    '+55 21 88888-8888',
    '1985-12-03'
),
(
    '01JQZ8K9M2N3P4Q5R6S7T8U9V2',
    'Pedro',
    'Oliveira',
    'pedro.oliveira@email.com',
    '+55 31 77777-7777',
    '1992-08-22'
),
(
    '01JQZ8K9M2N3P4Q5R6S7T8U9V3',
    'Ana',
    'Costa',
    'ana.costa@email.com',
    '+55 41 66666-6666',
    '1988-03-10'
),
(
    '01JQZ8K9M2N3P4Q5R6S7T8U9V4',
    'Carlos',
    'Ferreira',
    'carlos.ferreira@email.com',
    '+55 51 55555-5555',
    '1995-11-18'
)
ON CONFLICT (email) DO NOTHING; -- Prevents duplicate inserts

-- Display inserted customers count
SELECT 'Successfully inserted ' || COUNT(*) || ' customers' as result
FROM customer 
WHERE customer_id IN (
  '01JQZ8K9M2N3P4Q5R6S7T8U9V0',
  '01JQZ8K9M2N3P4Q5R6S7T8U9V1',
  '01JQZ8K9M2N3P4Q5R6S7T8U9V2',
  '01JQZ8K9M2N3P4Q5R6S7T8U9V3',
  '01JQZ8K9M2N3P4Q5R6S7T8U9V4'
);
