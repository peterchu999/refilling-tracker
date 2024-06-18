import db from './DBManager'

const TABLE_NAME = 'extinguisher'

/**
 *
 * @returns {{
 *  id: number,
 *  owner: string,
 *  owner_id: number,
 *  tank_number: text,
 *  agent: string,
 *  netto: number,
 *  refilling_date: Date,
 *  expire_date: Date,
 *  is_qr_printed: boolean
 * }} refillingData
 */
const fetchData = () => {
  try {
    const query = `SELECT * FROM ${TABLE_NAME} ORDER BY created_at DESC`
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
 *  owner_id: number,
 *  tank_number: number,
 *  owner: string,
 *  agent: string,
 *  netto: number,
 *  refilling_date: Date,
 *  expire_date: Date,
 * }} data refilling datatype
 *
 */
const insertData = async (
  { owner, agent, netto, refilling_date, expire_date, tank_number, owner_id },
  cb = async () => {}
) => {
  const begin = db.prepare('BEGIN')
  const commit = db.prepare('COMMIT')
  const rollback = db.prepare('ROLLBACK')
  begin.run()
  try {
    const insertScript = `INSERT INTO ${TABLE_NAME} (owner, owner_id, tank_number, agent, netto, refilling_date, expire_date, is_qr_printed)
    VALUES (?,?,?,?,?,?,?, 0)`

    const insertQuery = db.prepare(insertScript)
    const insertResult = insertQuery.run(
      owner,
      owner_id,
      tank_number,
      agent,
      netto,
      refilling_date,
      expire_date
    )
    const cbResult = await cb()
    commit.run()
    return { insertResult, cbResult }
  } catch (err) {
    console.error(err)
    rollback.run()
    throw err
  }
}

/**
 * Funcion to insert refilling data to database, Id would be auto incremented
 * @param {{
*  owner_id: number,
*  tank_number: number,
*  owner: string,
*  agent: string,
*  netto: number,
*  refilling_date: Date,
*  expire_date: Date,
* }} data refilling datatype
*
*/
const updateData = async (
 { id, agent, netto, refilling_date, expire_date, tank_number },
 cb = async () => {}
) => {
 const begin = db.prepare('BEGIN')
 const commit = db.prepare('COMMIT')
 const rollback = db.prepare('ROLLBACK')
 begin.run()
 try {
   const insertScript = `UPDATE ${TABLE_NAME} SET tank_number = ?, agent = ?, netto = ?, refilling_date = ?, expire_date = ?, is_qr_printed = 0
   WHERE id = ?`

   const insertQuery = db.prepare(insertScript)
   const insertResult = insertQuery.run(
     tank_number,
     agent,
     netto,
     refilling_date,
     expire_date,
     id
   )
   const cbResult = await cb()
   commit.run()
   return { insertResult, cbResult }
 } catch (err) {
   console.error(err)
   rollback.run()
   throw err
 }
}

export default {
  fetchData,
  insertData,
  updateData,
}
