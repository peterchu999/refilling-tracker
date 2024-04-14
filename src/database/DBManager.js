import Database from "better-sqlite3"
import path from "path"

const dbPath =
process.env.NODE_ENV === "development"
        ? "./table.db"
        : path.join(process.resourcesPath, "./table.db")


const db = new Database(dbPath)

db.pragma("journal_mode = WAL")

export default db