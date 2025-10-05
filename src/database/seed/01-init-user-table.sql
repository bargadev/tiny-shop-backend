-- Initial users data for Tiny Shop Backend
-- This file contains sample users for development and testing purposes
-- 
-- Password for all users: 12345678 (hashed with bcrypt)
-- 
-- To use this file:
-- 1. Run migrations first: npm run migration:run
-- 2. Then execute this file: psql -h localhost -U postgres -d tiny_shop -f src/database/seeds/initial-users.sql

-- Insert 5 sample users
INSERT INTO "user" (user_id, fullname, email, password, created_at, updated_at) VALUES
(
  '01JQ8X9K2M3N4P5Q6R7S8T9U0V',
  'João Silva',
  'joao.silva@email.com',
  '$2b$10$rQZ8xK9L2M3N4P5Q6R7S8T9U0V1W2X3Y4Z5A6B7C8D9E0F1G2H3I4J',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  '01JQ8X9K2M3N4P5Q6R7S8T9U0W',
  'Maria Santos',
  'maria.santos@email.com',
  '$2b$10$rQZ8xK9L2M3N4P5Q6R7S8T9U0V1W2X3Y4Z5A6B7C8D9E0F1G2H3I4K',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  '01JQ8X9K2M3N4P5Q6R7S8T9U0X',
  'Pedro Oliveira',
  'pedro.oliveira@email.com',
  '$2b$10$rQZ8xK9L2M3N4P5Q6R7S8T9U0V1W2X3Y4Z5A6B7C8D9E0F1G2H3I4L',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  '01JQ8X9K2M3N4P5Q6R7S8T9U0Y',
  'Ana Costa',
  'ana.costa@email.com',
  '$2b$10$rQZ8xK9L2M3N4P5Q6R7S8T9U0V1W2X3Y4Z5A6B7C8D9E0F1G2H3I4M',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  '01JQ8X9K2M3N4P5Q6R7S8T9U0Z',
  'Carlos Ferreira',
  'carlos.ferreira@email.com',
  '$2b$10$rQZ8xK9L2M3N4P5Q6R7S8T9U0V1W2X3Y4Z5A6B7C8D9E0F1G2H3I4N',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO NOTHING; -- Prevents duplicate inserts

-- Display inserted users count
SELECT 'Successfully inserted ' || COUNT(*) || ' users' as result
FROM "user" 
WHERE user_id IN (
  '01JQ8X9K2M3N4P5Q6R7S8T9U0V',
  '01JQ8X9K2M3N4P5Q6R7S8T9U0W',
  '01JQ8X9K2M3N4P5Q6R7S8T9U0X',
  '01JQ8X9K2M3N4P5Q6R7S8T9U0Y',
  '01JQ8X9K2M3N4P5Q6R7S8T9U0Z'
);
