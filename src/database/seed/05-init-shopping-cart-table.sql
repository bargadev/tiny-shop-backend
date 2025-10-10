-- Initial shopping_cart data for Tiny Shop Backend
-- This file contains sample shopping carts for development and testing purposes
-- 
-- Note: These shopping carts are linked to existing customers from 02-init-customer-table.sql
-- Customer IDs: 01JQZ8K9M2N3P4Q5R6S7T8W9V0=João Silva, 01JQZ8K9M2N3P4Q5R6S7T8W9V1=Maria Santos, etc.
-- 
-- To use this file:
-- 1. Run migrations first: npm run migration:run
-- 2. Execute previous seeds (01, 02, 03, 04)
-- 3. Then execute this file: psql -h localhost -U postgres -d tiny_shop -f src/database/seed/05-init-shopping-cart-table.sql

-- Insert 5 sample shopping carts (one for each customer)
INSERT INTO shopping_cart (
    cart_id,
    customer_id,
    created_at,
    updated_at
) VALUES 
(
    '01JQZAC1M2N3P4Q5R6S7T8W9V0',
    '01JQZ8K9M2N3P4Q5R6S7T8W9V0', -- João Silva
    CURRENT_TIMESTAMP - INTERVAL '5 days',
    CURRENT_TIMESTAMP - INTERVAL '5 days'
),
(
    '01JQZAC1M2N3P4Q5R6S7T8W9V1',
    '01JQZ8K9M2N3P4Q5R6S7T8W9V1', -- Maria Santos
    CURRENT_TIMESTAMP - INTERVAL '3 days',
    CURRENT_TIMESTAMP - INTERVAL '3 days'
),
(
    '01JQZAC1M2N3P4Q5R6S7T8W9V2',
    '01JQZ8K9M2N3P4Q5R6S7T8W9V2', -- Pedro Oliveira
    CURRENT_TIMESTAMP - INTERVAL '2 days',
    CURRENT_TIMESTAMP - INTERVAL '1 day'
),
(
    '01JQZAC1M2N3P4Q5R6S7T8W9V3',
    '01JQZ8K9M2N3P4Q5R6S7T8W9V3', -- Ana Costa
    CURRENT_TIMESTAMP - INTERVAL '7 days',
    CURRENT_TIMESTAMP - INTERVAL '7 days'
),
(
    '01JQZAC1M2N3P4Q5R6S7T8W9V4',
    '01JQZ8K9M2N3P4Q5R6S7T8W9V4', -- Carlos Ferreira
    CURRENT_TIMESTAMP - INTERVAL '1 day',
    CURRENT_TIMESTAMP
)
ON CONFLICT (cart_id) DO NOTHING; -- Prevents duplicate inserts

-- Display inserted shopping carts count
SELECT 'Successfully inserted ' || COUNT(*) || ' shopping carts' as result
FROM shopping_cart 
WHERE cart_id IN (
  '01JQZAC1M2N3P4Q5R6S7T8W9V0',
  '01JQZAC1M2N3P4Q5R6S7T8W9V1',
  '01JQZAC1M2N3P4Q5R6S7T8W9V2',
  '01JQZAC1M2N3P4Q5R6S7T8W9V3',
  '01JQZAC1M2N3P4Q5R6S7T8W9V4'
);

