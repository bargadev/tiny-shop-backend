-- Initial item data for development and testing
-- This file contains sample item data to populate the item table

-- Insert sample items
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
    '01JQZ9K1M2N3P4Q5R6S7T8U9V0',
    'Notebook Dell Inspiron 15',
    'Notebook Dell Inspiron 15 com processador Intel Core i5, 8GB RAM, SSD 256GB',
    'NB-DELL-I15-001',
    3499.99,
    15,
    'Eletrônicos'
),
(
    '01JQZ9K1M2N3P4Q5R6S7T8U9V1',
    'Mouse Logitech MX Master 3',
    'Mouse sem fio Logitech MX Master 3 com sensor de alta precisão e bateria recarregável',
    'MS-LOG-MX3-001',
    549.90,
    45,
    'Periféricos'
),
(
    '01JQZ9K1M2N3P4Q5R6S7T8U9V2',
    'Teclado Mecânico Keychron K2',
    'Teclado mecânico sem fio Keychron K2 com switches Gateron Brown e retroiluminação RGB',
    'KB-KEY-K2-001',
    899.00,
    30,
    'Periféricos'
),
(
    '01JQZ9K1M2N3P4Q5R6S7T8U9V3',
    'Monitor LG UltraWide 29"',
    'Monitor LG UltraWide 29 polegadas Full HD IPS com suporte a HDR10',
    'MN-LG-UW29-001',
    1899.99,
    20,
    'Monitores'
),
(
    '01JQZ9K1M2N3P4Q5R6S7T8U9V4',
    'Webcam Logitech C920',
    'Webcam Full HD 1080p Logitech C920 com microfone estéreo integrado',
    'WC-LOG-C920-001',
    449.90,
    60,
    'Periféricos'
),
(
    '01JQZ9K1M2N3P4Q5R6S7T8U9V5',
    'SSD Samsung 1TB',
    'SSD Samsung 970 EVO Plus NVMe M.2 1TB com velocidade de leitura até 3500MB/s',
    'SSD-SAM-970-1TB',
    699.00,
    50,
    'Armazenamento'
),
(
    '01JQZ9K1M2N3P4Q5R6S7T8U9V6',
    'Headset HyperX Cloud II',
    'Headset gamer HyperX Cloud II com som surround 7.1 e microfone removível',
    'HS-HYP-CL2-001',
    599.90,
    35,
    'Áudio'
),
(
    '01JQZ9K1M2N3P4Q5R6S7T8U9V7',
    'Cadeira Gamer DXRacer',
    'Cadeira gamer DXRacer ergonômica com ajuste de altura e apoio lombar',
    'CH-DXR-001',
    1599.00,
    10,
    'Móveis'
);

-- Verify the inserted data
SELECT 
    item_id,
    name,
    sku,
    price,
    quantity_available,
    category,
    created_at
FROM item 
ORDER BY created_at;

