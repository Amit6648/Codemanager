import mongoose from "mongoose";


const mongoconnect = async()=> {
try {
    if (mongoose.connect(process.env.mongo)===0) {
        await mongoose.connect(process.env.mongo);
    }
} catch (error) {
    console.log("there is a error :",  error );
    
}
}

export default mongoconnect;