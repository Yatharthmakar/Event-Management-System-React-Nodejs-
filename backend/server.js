require('dotenv').config();
const express = require('express');
const authRoutes = require('./routers/auth');
const eventRoutes = require('./routers/event');

const app = express();
const cors = require('cors');

app.use(express.json())
app.use(cors());

// dbconnect

// routes
app.use('/auth', authRoutes); 
app.use('/event', eventRoutes);


app.listen(process.env.PORT || 6010, ()=>{
    console.log("Server at port ",process.env.PORT || 6010 );
});