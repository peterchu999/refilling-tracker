
export const encryptPassword = (password, salt) => {
    return password + salt
}

export const generateSaltKey = () => {
    return 'salt'
}