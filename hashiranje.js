import bcrypt from 'bcrypt'

async function hashPassword(plainPassword, saltRounds) {
    try {
        let hash = await bcrypt.hash(plainPassword, saltRounds)
        return hash
    } catch(err) {
        console.error(`Doslo je do greske, neuspjesno hashiranje lozinke: ${err}`)
        return null
    }
}

async function comparePassword(plainPassword, hashPassword) {
    try {
        let result = await bcrypt.compare(plainPassword, hashPassword)
        return result
    } catch (err) {
        console.error(`Doslo je do greske, neuspjesno kompariranje hash vrijednosti ${err}`)
        return false
    }
}

export {hashPassword, comparePassword};