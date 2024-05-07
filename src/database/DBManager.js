import Database from 'better-sqlite3'
import path from 'path'

const check_table_exists = (db) => {
  const query = db.prepare("SELECT COUNT(*) as count FROM sqlite_master WHERE type='table'")
  const { count } = query.get()
  return count > 0
}

const migrate_table = async (db) => {
  const create_owner = `
    CREATE TABLE owners (
        id INTEGER PRIMARY KEY,
        name TEXT,
        username TEXT
    );
  `
  const create_extinguisher = `
    CREATE TABLE extinguisher (
            id INTEGER PRIMARY KEY,
            tank_number TEXT,
            owner_id  INTEGER NOT NULL,
            owner TEXT,
            agent TEXT,
            netto REAL,
            refilling_date DATE,
            expire_date DATE,
            is_qr_printed BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (owner_id) REFERENCES owners (id) 
    );
    `
  const create_owner_query = db.prepare(create_owner)
  const create_extinguisher_query = db.prepare(create_extinguisher)
  await create_owner_query.run()
  await create_extinguisher_query.run()
}

const dbPath =
  process.env.NODE_ENV === 'development'
    ? './resources/table.db'
    : path.join(process.resourcesPath, './table.db')

const db = new Database(dbPath)
db.pragma('journal_mode = WAL')

export const initialize_db_checking = () => {
  if (!check_table_exists(db)) {
    migrate_table(db)
  }
}

export default db
