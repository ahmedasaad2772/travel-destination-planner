-- Users table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    role VARCHAR(20) NOT NULL DEFAULT 'USER'
);

-- Destinations table
CREATE TABLE destinations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    country_name VARCHAR(100) NOT NULL,
    capital VARCHAR(100),
    region VARCHAR(100),
    population BIGINT,
    currency VARCHAR(50),
    flag_url VARCHAR(500),
    approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Want to Visit table (composite primary key)
CREATE TABLE want_to_visit (
    user_id BIGINT NOT NULL,
    destination_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, destination_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX idx_destinations_country ON destinations(country_name);
CREATE INDEX idx_destinations_region ON destinations(region);
CREATE INDEX idx_want_to_visit_user ON want_to_visit(user_id);
