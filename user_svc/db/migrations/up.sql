create table if not exists "users" (
  "id" SERIAL PRIMARY KEY, -- Auto-incrementing integer primary key
  "name" VARCHAR(255) NOT NULL UNIQUE, -- User's name
  "email" VARCHAR(255) NOT NULL UNIQUE, -- User's email address
  "hashed_password" VARCHAR(255) NOT NULL, -- Hashed password
  "is_active" BOOLEAN DEFAULT TRUE 
);