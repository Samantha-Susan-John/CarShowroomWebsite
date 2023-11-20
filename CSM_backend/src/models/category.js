const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({

    name : { type : String, 
            required : true, 
            trim : true 
        },
    slug : { type : String,                                   //to make sure can't delete the earlier copy of category if POSTed again
            required : true,
            unique : true 
        },
    parentId : { type : String      
        }

}, { timestamps : true });

module.exports = mongoose.model('Category', categorySchema );