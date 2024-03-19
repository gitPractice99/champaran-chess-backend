import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const dbconnection  = async () => {
    try {
        const response = await mongoose.connect(`${process.env.DATABSE_URI}` , {
            dbName:"champaran_register",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        // sucessfull console alert 
        .then(()=>{
            console.log("Database connected Successfully") ;
            //  process.exit(1)
        });
        
    } catch (error) {
        console.log("Unable to connect DB :: " , error);
    }
}

export default dbconnection;
