const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Expense = new Schema({
    description: {
        type: String
    },
    category: {
        type: String
    },
    responsible: {
        type: String
    },
    value:{
        type: Number
    },
    date:{
        type: Date,
        default: Date.now      
    },
    deleted:{
        type: Boolean,
        default: false
    }
},
    {
        collection:'expenses',
        versionKey: false
});

module.exports = mongoose.model('Expense', Expense);