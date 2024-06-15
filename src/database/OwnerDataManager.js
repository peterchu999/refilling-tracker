import db from './DBManager'

const TABLE_NAME = 'owners'

/**
 *
 * @returns {{
 *  id: number,
 *  owner: string,
 *  agent: string,
 *  netto: number,
 *  refilling_date: Date,
 *  expire_date: Date,
 *  is_qr_printed: boolean
 * }} refillingData
 */
const fetchOwnerData = () => {
  try {
    const query = `SELECT * FROM ${TABLE_NAME}`
    const readQuery = db.prepare(query)
    const rowList = readQuery.all()
    return rowList
  } catch (err) {
    console.error(err)
    throw err
  }
}

/**
 * Funcion to insert refilling data to database, Id would be auto incremented
 * @param {{
 *  owner: string,
 *  agent: string,
 *  netto: number,
 *  refilling_date: Date,
 *  expire_date: Date,
 * }} data refilling datatype
 *
 */
const insertOwnerData = async ({ id, name, username }, cb = async () => {}) => {
  const begin = db.prepare('BEGIN')
  const commit = db.prepare('COMMIT')
  const rollback = db.prepare('ROLLBACK')
  begin.run()
  try {
    const insertScript = `INSERT INTO ${TABLE_NAME} (id, name, username)
    VALUES (?,?,?)`
    const insertQuery = db.prepare(insertScript)
    const insertResult = insertQuery.run(id, name, username)
    const cbResult = await cb()
    commit.run()
    return {insertResult, cbResult}
  } catch (err) {
    console.error(err)
    rollback.run()
    throw err
  }
}

export default {
  fetchOwnerData,
  insertOwnerData
}
