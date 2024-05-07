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
const insertOwnerData = ({ id, name, username }) => { 
  try {
    const insertScript = `INSERT INTO ${TABLE_NAME} (id, name, username)
    VALUES (?,?,?)`
    const insertQuery = db.prepare(insertScript)
    const insertResult = insertQuery.run( id, name, username )
    return insertResult
  } catch (err) {
    console.error(err)
    throw err
  }
}

export default {
  fetchOwnerData,
  insertOwnerData
}
