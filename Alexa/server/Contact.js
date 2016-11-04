
module.exports = function (express, alexaAppServerObject) {
    express.use('/contact', function (req, res) {
        console.log('contact!');
        res.render('command', { title: 'command', year: new Date().getFullYear(), message: 'Your command page' });
    });
};
