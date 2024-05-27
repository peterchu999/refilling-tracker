import { createKysely } from '@vercel/postgres-kysely'

const DATABASE_NAME = 'Extinguisher'

const db = createKysely()

export const insertExtinguisher = async ({
  agent,
  netto,
  refilling_date,
  expire_date,
  tank_number,
  owner_id
}) => {
    return db
    .insertInto(DATABASE_NAME)
    .values({ agent, netto, refilling_date, expire_date, tank_number, owner_id, is_qr_printed: false })
    .returningAll()
    .executeTakeFirstOrThrow()
}
  

export const updateExtinguisher = async (
  id,
  {  agent, netto, refilling_date, expire_date, tank_number }
) =>
  db
    .updateTable(DATABASE_NAME)
    .set({
      ...(!!agent && { agent }),
      ...(!!netto && { netto }),
      ...(!!refilling_date && { refilling_date }),
      ...(!!expire_date && { expire_date }),
      ...(!!tank_number && { tank_number })
    })
    .where('id', '=', id)
    .executeTakeFirst()
