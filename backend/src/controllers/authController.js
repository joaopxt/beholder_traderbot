const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

function doLogin(req, res, next) {
    const email = req.body.email
    const password = req.body.password

    if (email === 'joao@gmail.com'
        && bcrypt.compareSync(password, '$2a$12$Cgn00qrcOTlyU/d77yjDI.j/ptaIo8mzOX3DV0mTFXuoCO0A1HNYm')) {
            const token = jwt.sign({id: 1}, process.env.JWT_SECRET, {
                expiresIn:parseInt(process.env.JWT_EXPIRES)
            })
        res.json({token})
    } else
        res.sendStatus(401)
}

const blacklist = []

function doLogout(req, res, next) {
const token = req.headers['authorization']
blacklist.push(token)
res.sendStatus(200)
}

function isBlacklisted(token){
    return blacklist.some(t => t === token)
}

module.exports = {
    doLogin,
    doLogout,
    isBlacklisted
}