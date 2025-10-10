-- Initial order data for Tiny Shop Backend
-- This file contains sample orders for development and testing purposes
-- 
-- Note: These orders are linked to:
-- - shopping_cart from 05-init-shopping-cart-table.sql
-- - customer from 02-init-customer-table.sql
-- - address from 03-init-address-table.sql
-- 
-- To use this file:
-- 1. Run migrations first: npm run migration:run
-- 2. Execute previous seeds (01, 02, 03, 04, 05, 06)
-- 3. Then execute this file: psql -h localhost -U postgres -d tiny_shop -f src/database/seed/07-init-order-table.sql

-- Insert sample orders (3 customers have completed orders)
INSERT INTO "order" (
    order_id,
    cart_id,
    customer_id,
    address_id,
    total_amount,
    status,
    payment_method,
    created_at,
    updated_at
) VALUES 
(
    '01JQZAD1M2N3P4Q5R6S7T8W9V0',
    '01JQZAC1M2N3P4Q5R6S7T8W9V0', -- João Silva's cart
    '01JQZ8K9M2N3P4Q5R6S7T8W9V0', -- João Silva
    '01JQZAA1M2N3P4Q5R6S7T8W9V0', -- João's primary address (Rua das Flores)
    4948.89, -- Notebook (3499.99) + Mouse (549.90) + Teclado (899.00)
    'delivered',
    'credit_card',
    CURRENT_TIMESTAMP - INTERVAL '5 days',
    CURRENT_TIMESTAMP - INTERVAL '1 day'
),
(
    '01JQZAD1M2N3P4Q5R6S7T8W9V1',
    '01JQZAC1M2N3P4Q5R6S7T8W9V1', -- Maria Santos's cart
    '01JQZ8K9M2N3P4Q5R6S7T8W9V1', -- Maria Santos
    '01JQZAA4M2N3P4Q5R6S7T8W9V1', -- Maria's secondary address (Rio de Janeiro)
    4249.88, -- Monitor (1899.99 x 2) + Webcam (449.90)
    'shipped',
    'debit_card',
    CURRENT_TIMESTAMP - INTERVAL '3 days',
    CURRENT_TIMESTAMP - INTERVAL '1 day'
),
(
    '01JQZAD1M2N3P4Q5R6S7T8W9V2',
    '01JQZAC1M2N3P4Q5R6S7T8W9V3', -- Ana Costa's cart
    '01JQZ8K9M2N3P4Q5R6S7T8W9V3', -- Ana Costa
    '01JQZAA8M2N3P4Q5R6S7T8W9V3', -- Ana's primary address (Rua da Praia, Ipanema)
    6998.98, -- Cadeira (1599.00) + Notebook (3499.99) + Monitor (1899.99)
    'paid',
    'pix',
    CURRENT_TIMESTAMP - INTERVAL '7 days',
    CURRENT_TIMESTAMP - INTERVAL '6 days'
)
ON CONFLICT (order_id) DO NOTHING; -- Prevents duplicate inserts

-- Display inserted orders count
SELECT 'Successfully inserted ' || COUNT(*) || ' orders' as result
FROM "order" 
WHERE order_id IN (
  '01JQZAD1M2N3P4Q5R6S7T8W9V0',
  '01JQZAD1M2N3P4Q5R6S7T8W9V1',
  '01JQZAD1M2N3P4Q5R6S7T8W9V2'
);

-- Display order summary with customer and address information
SELECT 
    o.order_id,
    c.first_name || ' ' || c.last_name as customer_name,
    c.email,
    a.street || ', ' || a.number || ' - ' || a.city || '/' || a.state as delivery_address,
    o.total_amount,
    o.status,
    o.payment_method,
    o.created_at as order_date
FROM "order" o
JOIN customer c ON o.customer_id = c.customer_id
JOIN address a ON o.address_id = a.address_id
WHERE o.order_id IN (
  '01JQZAD1M2N3P4Q5R6S7T8W9V0',
  '01JQZAD1M2N3P4Q5R6S7T8W9V1',
  '01JQZAD1M2N3P4Q5R6S7T8W9V2'
)
ORDER BY o.created_at DESC;

-- Display order items details
SELECT 
    o.order_id,
    c.first_name || ' ' || c.last_name as customer_name,
    i.name as item_name,
    sci.quantity,
    sci.price as unit_price,
    (sci.quantity * sci.price) as subtotal
FROM "order" o
JOIN customer c ON o.customer_id = c.customer_id
JOIN shopping_cart_item sci ON o.cart_id = sci.cart_id
JOIN item i ON sci.item_id = i.item_id
WHERE o.order_id IN (
  '01JQZAD1M2N3P4Q5R6S7T8W9V0',
  '01JQZAD1M2N3P4Q5R6S7T8W9V1',
  '01JQZAD1M2N3P4Q5R6S7T8W9V2'
)
ORDER BY o.order_id, i.name;

