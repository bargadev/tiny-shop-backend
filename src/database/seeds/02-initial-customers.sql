-- Initial customer data for development and testing
-- This file contains sample customer data to populate the customer table

-- Insert sample customers
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
);

-- Verify the inserted data
SELECT 
    customer_id,
    first_name,
    last_name,
    email,
    phone_number,
    date_of_birth,
    created_at
FROM customer 
ORDER BY created_at;
