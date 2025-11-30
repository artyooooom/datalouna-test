DROP TABLE IF EXISTS purchases;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    login       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    balance     NUMERIC(12, 2) NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE products (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    price       NUMERIC(12, 2) NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE purchases (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id  INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO users (login, password, balance, created_at, updated_at)
VALUES (
    'admin',
    '123',      -- ofc hashed in real world
    500.00,
    '2025-11-30 12:00:00+00',
    '2025-11-30 12:00:00+00'
);

INSERT INTO products (name, price, created_at, updated_at) VALUES
(
    'AK-47 | Baroque Purple (Factory New)',
    123.45,
    '2025-11-30 12:00:00+00',
    '2025-11-30 12:00:00+00'
),
(
    'Sticker | aumaN | Katowice 2019',
    19.99,
    '2025-11-30 12:05:00+00',
    '2025-11-30 12:05:00+00'
),
(
    'Sticker | Aurora | Austin 2025',
    7.77,
    '2025-11-30 12:10:00+00',
    '2025-11-30 12:10:00+00'
),
(
    'Negev | Army Sheen (Field-Tested)',
    3.49,
    '2025-11-30 12:15:00+00',
    '2025-11-30 12:15:00+00'
),
(
    '★ Navaja Knife | Urban Masked (Well-Worn)',
    249.99,
    '2025-11-30 12:20:00+00',
    '2025-11-30 12:20:00+00'
);