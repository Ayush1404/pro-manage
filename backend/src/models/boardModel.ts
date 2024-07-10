import joi from 'joi';
import mongoose from 'mongoose';

const boardSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true
    },
    boardMembers:{
        type:[String],
        default:[]
    }
}, {
    timestamps: true
});


export const boardModel = mongoose.model("boards", boardSchema);
