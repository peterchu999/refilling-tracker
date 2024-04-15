import db from './DBManager'

const TABLE_NAME = 'extinguisher'

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
const fetchData = () => {
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
const insertData = ({ owner, agent, netto, refilling_date, expire_date }) => {
  
  try {
    const insertScript = `INSERT INTO ${TABLE_NAME} (owner, agent, netto, refilling_date, expire_date, is_qr_printed)
    VALUES (?,?,?,?,?, NULL)`
    const insertQuery = db.prepare(insertScript)
    const insertResult = insertQuery.run(owner, agent, netto, refilling_date.toDateString(), expire_date.toDateString())
    return insertResult.changes
  } catch (err) {
    console.error(err)
    throw err
  }
}

export default {
  fetchData,
  insertData
}
