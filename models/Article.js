var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    imgLink:  {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    link: {
        //find validation
        type: String,
        required: true,
        unique: true
    },
    desc: {
        type: String,
        required: true
    },
    // comment: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Comment'
    // },
    noteId: {
        type: Schema.Types.ObjectId,
        ref: "note"
    }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
