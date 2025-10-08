-- Initial item data for Tiny Shop Backend
-- This file contains sample items for development and testing purposes
-- 
-- Note: These are standalone items that don't depend on other tables
-- 
-- To use this file:
-- 1. Run migrations first: npm run migration:run
-- 2. Then execute this file: psql -h localhost -U postgres -d tiny_shop -f src/database/seed/04-init-item-table.sql

-- Insert 8 sample items
INSERT INTO item (
    item_id,
    name,
    description,
    sku,
    price,
    quantity_available,
    category
) VALUES 
(
    '01JQZ9K1M2N3P4Q5R6S7T8W9V0',
    'Notebook Dell Inspiron 15',
    'Notebook Dell Inspiron 15 com processador Intel Core i5, 8GB RAM, SSD 256GB',
    'NB-DELL-I15-001',
    3499.99,
    15,
    'Eletrônicos'
),
(
    '01JQZ9K1M2N3P4Q5R6S7T8W9V1',
    'Mouse Logitech MX Master 3',
    'Mouse sem fio Logitech MX Master 3 com sensor de alta precisão e bateria recarregável',
    'MS-LOG-MX3-001',
    549.90,
    45,
    'Periféricos'
),
(
    '01JQZ9K1M2N3P4Q5R6S7T8W9V2',
    'Teclado Mecânico Keychron K2',
    'Teclado mecânico sem fio Keychron K2 com switches Gateron Brown e retroiluminação RGB',
    'KB-KEY-K2-001',
    899.00,
    30,
    'Periféricos'
),
(
    '01JQZ9K1M2N3P4Q5R6S7T8W9V3',
    'Monitor LG UltraWide 29"',
    'Monitor LG UltraWide 29 polegadas Full HD IPS com suporte a HDR10',
    'MN-LG-UW29-001',
    1899.99,
    20,
    'Monitores'
),
(
    '01JQZ9K1M2N3P4Q5R6S7T8W9V4',
    'Webcam Logitech C920',
    'Webcam Full HD 1080p Logitech C920 com microfone estéreo integrado',
    'WC-LOG-C920-001',
    449.90,
    60,
    'Periféricos'
),
(
    '01JQZ9K1M2N3P4Q5R6S7T8W9V5',
    'SSD Samsung 1TB',
    'SSD Samsung 970 EVO Plus NVMe M.2 1TB com velocidade de leitura até 3500MB/s',
    'SSD-SAM-970-1TB',
    699.00,
    50,
    'Armazenamento'
),
(
    '01JQZ9K1M2N3P4Q5R6S7T8W9V6',
    'Headset HyperX Cloud II',
    'Headset gamer HyperX Cloud II com som surround 7.1 e microfone removível',
    'HS-HYP-CL2-001',
    599.90,
    35,
    'Áudio'
),
(
    '01JQZ9K1M2N3P4Q5R6S7T8W9V7',
    'Cadeira Gamer DXRacer',
    'Cadeira gamer DXRacer ergonômica com ajuste de altura e apoio lombar',
    'CH-DXR-001',
    1599.00,
    10,
    'Móveis'
)
ON CONFLICT (sku) DO NOTHING; -- Prevents duplicate inserts

-- Display inserted items count
SELECT 'Successfully inserted ' || COUNT(*) || ' items' as result
FROM item 
WHERE item_id IN (
  '01JQZ9K1M2N3P4Q5R6S7T8W9V0',
  '01JQZ9K1M2N3P4Q5R6S7T8W9V1',
  '01JQZ9K1M2N3P4Q5R6S7T8W9V2',
  '01JQZ9K1M2N3P4Q5R6S7T8W9V3',
  '01JQZ9K1M2N3P4Q5R6S7T8W9V4',
  '01JQZ9K1M2N3P4Q5R6S7T8W9V5',
  '01JQZ9K1M2N3P4Q5R6S7T8W9V6',
  '01JQZ9K1M2N3P4Q5R6S7T8W9V7'
);

