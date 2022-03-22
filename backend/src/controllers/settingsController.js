function getSettings(req, res, next) {

    res.json({
        email: 'joao.peixoto@bfcsa.com.br'
    })
}

module.exports = { getSettings }