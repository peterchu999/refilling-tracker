import { createKysely } from '@vercel/postgres-kysely'

const DATABASE_NAME = 'Owner'

const db = createKysely()

export const insertOwner = async ({ name, username, password, salt }) =>
  db.insertInto(DATABASE_NAME).values({ name, username, password, salt }).returningAll().executeTakeFirstOrThrow()

export const fetchOwners = async () => db.selectFrom(DATABASE_NAME).selectAll().execute()

export const updateOwner = async (id, { name, username, password }) =>
  db
    .updateTable(DATABASE_NAME)
    .set({
      ...(!!name && { name }),
      ...(!!username && { username }),
      ...(!!password && { password })
    })
    .where('id', '=', id) 
    .executeTakeFirst()
