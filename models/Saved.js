var mongoose = require('mongoose');

var SavedSchema = new mongoose.Schema({
    title: String,
    date: String,
    desc: String,
    link: String,
    noteId: String
});

var Saved = mongoose.model('Saved', SavedSchema);

module.exports = Saved;