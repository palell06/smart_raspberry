
module.exports = function (express, alexaAppServerObject) {
    express.use('/contact', function (req, res) {
        res.render('command', { title: 'command', year: new Date().getFullYear(), message: 'Your command page' });
    });
};
