"use strict";
function index(req, res) {
    console.log("index");
    res.render('index', { title: 'Express', year: new Date().getFullYear() });
}
exports.index = index;
;
function about(req, res) {
    console.log("about");
    res.render('about', { title: 'About', year: new Date().getFullYear(), message: 'Your application description page' });
}
exports.about = about;
;
function contact(req, res) {
    console.log("contact");
    res.render('contact', { title: 'Contact', year: new Date().getFullYear(), message: 'Your contact page' });
}
exports.contact = contact;
;
function command(req, res) {
    console.log("command");
    res.render('command', { title: 'command', year: new Date().getFullYear(), message: 'Your command page' });
}
exports.command = command;
//# sourceMappingURL=index.js.map