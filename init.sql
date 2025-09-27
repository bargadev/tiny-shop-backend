-- Initialize database for Tiny Shop
-- Database is created by docker-compose environment variables

-- Create users table with new structure
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE NOT NULL,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert some sample data (with hashed passwords - 'password123')
INSERT INTO users (user_id, fullname, email, password) VALUES 
    ('user_001', 'João Silva', 'joao@example.com', '$2b$10$example_hash_1'),
    ('user_002', 'Maria Santos', 'maria@example.com', '$2b$10$example_hash_2')
ON CONFLICT (email) DO NOTHING;
