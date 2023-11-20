const express = require('express');
const app = express();
const env = require('dotenv');
const mongoose = require('mongoose');
const { application } = require('express');


//routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin/auth');
const categoryRoutes = require('./routes/admin/category')

const PORT= 8080


//environment variables
env.config();

//mongdb connection
//mongodb+srv://samanthasjohn22:<password>@cluster0.osd469u.mongodb.net/?retryWrites=true&w=majority
//mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.osd469u.mongodb.net/?retryWrites=true&w=majority
//mongodb+srv://samanthasjohn22:Sam2002@cluster0.osd469u.mongodb.net/?retryWrites=true&w=majority
mongoose.connect(`mongodb+srv://samanthasjohn22:Sam2002@cluster0.osd469u.mongodb.net/?retryWrites=true&w=majority`).then (() => 
{
    console.log('Database connected');
});

// Middleware to parse request body
//app.use(bodyParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api' , authRoutes);
app.use('/api' , adminRoutes);
app.use('/api' , categoryRoutes);




app.post('/data', (req, res, next) => {
  console.log(req.body);
  res.status(200).json({ 
    message: req.body });
});

console.log('PORT:', PORT);                                     //hardcoding PORT because its not loading from .env
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} `);
});

// app.listen(process.env.PORT, () => {
//   console.log(`Server is running on port ${process.env.PORT}`);
// });