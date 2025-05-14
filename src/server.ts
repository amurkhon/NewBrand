import dotenv from 'dotenv';
dotenv.config();

import mongoose from "mongoose";
import app from './app';

mongoose.connect(`${process.env.MONGO_URL}`, {})
.then((data) => {
    console.log(`MongoDB connected successfully!`)
    const PORT = process.env.PORT ?? 4010;
    app.listen(PORT, function() {
        console.log(`The server is running successfully on port: ${PORT}`);
    })
})
.catch(err => console.log("ERROR on connection MongoDB", err));