-- Initial shopping_cart_item data for Tiny Shop Backend
-- This file contains sample shopping cart items for development and testing purposes
-- 
-- Note: These items are linked to:
-- - shopping_cart from 05-init-shopping-cart-table.sql
-- - item from 04-init-item-table.sql
-- 
-- To use this file:
-- 1. Run migrations first: npm run migration:run
-- 2. Execute previous seeds (01, 02, 03, 04, 05)
-- 3. Then execute this file: psql -h localhost -U postgres -d tiny_shop -f src/database/seed/06-init-shopping-cart-item-table.sql

-- Insert sample shopping cart items
INSERT INTO shopping_cart_item (
    cart_id,
    item_id,
    quantity,
    price,
    added_at
) VALUES 
-- João Silva's cart (cart_id: 01JQZAC1M2N3P4Q5R6S7T8W9V0)
('01JQZAC1M2N3P4Q5R6S7T8W9V0', '01JQZ9K1M2N3P4Q5R6S7T8W9V0', 1, 3499.99, CURRENT_TIMESTAMP - INTERVAL '5 days'), -- Notebook Dell
('01JQZAC1M2N3P4Q5R6S7T8W9V0', '01JQZ9K1M2N3P4Q5R6S7T8W9V1', 1, 549.90, CURRENT_TIMESTAMP - INTERVAL '5 days'), -- Mouse Logitech
('01JQZAC1M2N3P4Q5R6S7T8W9V0', '01JQZ9K1M2N3P4Q5R6S7T8W9V2', 1, 899.00, CURRENT_TIMESTAMP - INTERVAL '5 days'), -- Teclado Keychron

-- Maria Santos's cart (cart_id: 01JQZAC1M2N3P4Q5R6S7T8W9V1)
('01JQZAC1M2N3P4Q5R6S7T8W9V1', '01JQZ9K1M2N3P4Q5R6S7T8W9V3', 2, 1899.99, CURRENT_TIMESTAMP - INTERVAL '3 days'), -- Monitor LG (2 unidades)
('01JQZAC1M2N3P4Q5R6S7T8W9V1', '01JQZ9K1M2N3P4Q5R6S7T8W9V4', 1, 449.90, CURRENT_TIMESTAMP - INTERVAL '3 days'), -- Webcam Logitech

-- Pedro Oliveira's cart (cart_id: 01JQZAC1M2N3P4Q5R6S7T8W9V2)
('01JQZAC1M2N3P4Q5R6S7T8W9V2', '01JQZ9K1M2N3P4Q5R6S7T8W9V5', 2, 699.00, CURRENT_TIMESTAMP - INTERVAL '2 days'), -- SSD Samsung (2 unidades)
('01JQZAC1M2N3P4Q5R6S7T8W9V2', '01JQZ9K1M2N3P4Q5R6S7T8W9V6', 1, 599.90, CURRENT_TIMESTAMP - INTERVAL '2 days'), -- Headset HyperX
('01JQZAC1M2N3P4Q5R6S7T8W9V2', '01JQZ9K1M2N3P4Q5R6S7T8W9V1', 2, 549.90, CURRENT_TIMESTAMP - INTERVAL '1 day'), -- Mouse Logitech (2 unidades)

-- Ana Costa's cart (cart_id: 01JQZAC1M2N3P4Q5R6S7T8W9V3)
('01JQZAC1M2N3P4Q5R6S7T8W9V3', '01JQZ9K1M2N3P4Q5R6S7T8W9V7', 1, 1599.00, CURRENT_TIMESTAMP - INTERVAL '7 days'), -- Cadeira Gamer
('01JQZAC1M2N3P4Q5R6S7T8W9V3', '01JQZ9K1M2N3P4Q5R6S7T8W9V0', 1, 3499.99, CURRENT_TIMESTAMP - INTERVAL '7 days'), -- Notebook Dell
('01JQZAC1M2N3P4Q5R6S7T8W9V3', '01JQZ9K1M2N3P4Q5R6S7T8W9V3', 1, 1899.99, CURRENT_TIMESTAMP - INTERVAL '7 days'), -- Monitor LG

-- Carlos Ferreira's cart (cart_id: 01JQZAC1M2N3P4Q5R6S7T8W9V4)
('01JQZAC1M2N3P4Q5R6S7T8W9V4', '01JQZ9K1M2N3P4Q5R6S7T8W9V2', 2, 899.00, CURRENT_TIMESTAMP - INTERVAL '1 day'), -- Teclado Keychron (2 unidades)
('01JQZAC1M2N3P4Q5R6S7T8W9V4', '01JQZ9K1M2N3P4Q5R6S7T8W9V4', 3, 449.90, CURRENT_TIMESTAMP), -- Webcam Logitech (3 unidades)
('01JQZAC1M2N3P4Q5R6S7T8W9V4', '01JQZ9K1M2N3P4Q5R6S7T8W9V5', 1, 699.00, CURRENT_TIMESTAMP); -- SSD Samsung

-- Display inserted shopping cart items count
SELECT 'Successfully inserted ' || COUNT(*) || ' shopping cart items' as result
FROM shopping_cart_item 
WHERE cart_id IN (
  '01JQZAC1M2N3P4Q5R6S7T8W9V0',
  '01JQZAC1M2N3P4Q5R6S7T8W9V1',
  '01JQZAC1M2N3P4Q5R6S7T8W9V2',
  '01JQZAC1M2N3P4Q5R6S7T8W9V3',
  '01JQZAC1M2N3P4Q5R6S7T8W9V4'
);

-- Display cart summary
SELECT 
    sc.cart_id,
    c.first_name || ' ' || c.last_name as customer_name,
    COUNT(sci.item_id) as total_items,
    SUM(sci.quantity) as total_quantity,
    SUM(sci.quantity * sci.price) as total_value
FROM shopping_cart sc
JOIN customer c ON sc.customer_id = c.customer_id
LEFT JOIN shopping_cart_item sci ON sc.cart_id = sci.cart_id
WHERE sc.cart_id IN (
  '01JQZAC1M2N3P4Q5R6S7T8W9V0',
  '01JQZAC1M2N3P4Q5R6S7T8W9V1',
  '01JQZAC1M2N3P4Q5R6S7T8W9V2',
  '01JQZAC1M2N3P4Q5R6S7T8W9V3',
  '01JQZAC1M2N3P4Q5R6S7T8W9V4'
)
GROUP BY sc.cart_id, c.first_name, c.last_name
ORDER BY sc.cart_id;

