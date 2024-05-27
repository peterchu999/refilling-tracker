import sha256 from 'crypto-js/sha256';
import cryptolib from "crypto-js/lib-typedarrays"

export const encryptPassword = (password, envSalt) => {
    return sha256(password + envSalt).toString()
}

export const generateSaltKey = () => {
    return cryptolib.random(16).toString()
}