import { app } from "./app.js";
import dotenv from "dotenv";
import { ConnectDB } from "./Database/connection.js";
dotenv.config();

ConnectDB()
.then(() => {
  app.listen(process.env.PORT, () => {
    console.log("Server is running on Port", process.env.PORT);
  });
})
.catch((error)=>{
    console.log('Something went wrong',error)
})
