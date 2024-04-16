-- SQLite
 CREATE TABLE extinguisher (
    id INTEGER PRIMARY KEY,
    owner TEXT,
    agent TEXT,
    netto REAL,
    refilling_date DATE,
    expire_date DATE,
    is_qr_printed BOOLEAN DEFAULT FALSE
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);