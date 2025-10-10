-- Initial payment method data for Tiny Shop Backend
-- This file contains the available payment methods for the system
-- 
-- To use this file:
-- 1. Run migrations first: npm run migration:run
-- 2. Execute this file: psql -h localhost -U postgres -d tiny_shop -f src/database/seed/04.5-init-payment-method-table.sql

-- Insert payment methods
INSERT INTO payment_method (
    payment_method_id,
    name,
    description,
    is_active,
    created_at,
    updated_at
) VALUES 
(
    '01JQZPM1M2N3P4Q5R6S7T8W9V0',
    'Credit Card',
    'Payment via credit card with installment options',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    '01JQZPM1M2N3P4Q5R6S7T8W9V1',
    'Debit Card',
    'Direct payment via debit card',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    '01JQZPM1M2N3P4Q5R6S7T8W9V2',
    'PIX',
    'Instant payment via PIX',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    '01JQZPM1M2N3P4Q5R6S7T8W9V3',
    'Bank Slip',
    'Payment via bank slip (Boleto)',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    '01JQZPM1M2N3P4Q5R6S7T8W9V4',
    'Cash',
    'Payment in cash on delivery',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (payment_method_id) DO NOTHING; -- Prevents duplicate inserts

-- Display inserted payment methods count
SELECT 'Successfully inserted ' || COUNT(*) || ' payment methods' as result
FROM payment_method;

-- Display all payment methods
SELECT 
    id,
    payment_method_id,
    name,
    description,
    is_active,
    created_at
FROM payment_method
ORDER BY id;

