import dotenv from 'dotenv';
dotenv.config();

import mongoose from "mongoose";
import server from './app';

mongoose.connect(`${process.env.MONGO_URL}`, {})
.then((data) => {
    console.log(`MongoDB connected successfully!`)
    const PORT = process.env.PORT ?? 4010;
    server.listen(PORT, function() {
        console.log(`The server is running successfully on port: ${PORT}`);
        console.info(`Admin project on http://localhost:${PORT}/admin \n`);
    })
})
.catch(err => console.log("ERROR on connection MongoDB", err));