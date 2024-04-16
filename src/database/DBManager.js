import Database from 'better-sqlite3'
import path from 'path'

const check_table_exists = (db) => {
  const query = db.prepare("SELECT COUNT(*) as count FROM sqlite_master WHERE type='table'")
  const { count } = query.get()
  return count > 0
}

const migrate_table = (db) => {
  const migration_script = `
        CREATE TABLE extinguisher (
                id INTEGER PRIMARY KEY,
                owner TEXT,
                agent TEXT,
                netto REAL,
                refilling_date DATE,
                expire_date DATE,
                is_qr_printed BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `
  const query = db.prepare(migration_script)
  const result = query.run()
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
