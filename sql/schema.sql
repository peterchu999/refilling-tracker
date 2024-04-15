-- SQLite
CREATE TABLE extinguisher (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner TEXT,
    agent TEXT,
    netto REAL,
    refilling_date DATE,
    expire_date DATE,
    is_qr_printed BOOLEAN DEFAULT FALSE
);
