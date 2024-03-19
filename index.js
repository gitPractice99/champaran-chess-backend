import express from "express";
import dbconnection from "./database.js";
import User from "./userModel.js";
import cors from "cors";
import dotenv from "dotenv";
const app = express();
dotenv.config();
app.use(express.json());
dbconnection();


app.use(cors({
  origin:`${process.env.CLIENT_APP_URI}`
}));

app.get("/" , (req,res) => {
    return res.status(200).json({
        success:true,
        message:"server is working"
    });
})

app.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      parant,
      kidsname,
      kidsage,
      country,
      experiance,
      description
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !parant ||
      !kidsname ||
      !kidsage ||
      !country ||
      !experiance
    ) {
      return res.status(403).json({
        success: false,
        message: "All Fields are required",
      });
    };
   
    const response = await User.create(
      {
        name,
        email,
        phone,
        parant,
        kidsname,
        kidsage,
        country,
        description,
        experiance:{
          id:experiance.id,
          checked:experiance.checked
        },
      }
    );

    return res.status(201).json({
      success: true,
      message: "User Created Successfully",
      user: response,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unable to register the user.",
      error: error.message,
    });
  }
});

app.listen(process.env.PORT,()=>{
    console.log("Server started successfull :: " , process.env.PORT);
});
