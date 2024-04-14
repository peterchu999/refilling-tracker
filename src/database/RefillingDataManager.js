import db from "./DBManager"

const fetchData = () => {
    console.log(db,'FEtch db inside')
    try {
        const query = `SELECT * FROM refill`
        const readQuery = db.prepare(query)
        const rowList = readQuery.all()
        return rowList
    } catch (err) {
        console.error(err)
        throw err
    }
}


export default {
    fetchData
}