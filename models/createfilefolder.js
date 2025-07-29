import mongoose from "mongoose";

const folderschema = new mongoose.Schema({
    name: String,
    discription : String,
    code : String,
    parent : String,
    type : String,
    time :  {
        type: Date,
        default: Date.now,
    },
    language : String,
    breadcrumb : Array
})

const Folder = mongoose.models.folder || mongoose.model("folder", folderschema);
export default Folder;