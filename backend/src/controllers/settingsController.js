function getSettings(req, res, next) {

    res.json({
        email: 'joao@gmail.com'
    })
}

module.exports = { getSettings }