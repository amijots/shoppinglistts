const mongoose = require("mongoose");


const ListSchema = mongoose.Schema( {
    listId: {
        type: String,
        required: true,
    },
    listName: {
        type: String,
        default: "Shopping List",
    },
    list: [{
        name: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        pinned: {
            type: Boolean,
            required: true,
        },
        completed: {
            type: Boolean,
            default: false,
        }
    }],

})

module.exports = mongoose.model("list", ListSchema);