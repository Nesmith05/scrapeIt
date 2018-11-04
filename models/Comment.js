const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    title: String,
    body: String
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;