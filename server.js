const express=require("express")
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan')
const connectDB = require('./config/db');
const authRoutes=require("./routes/authRoutes")
const referralRoutes=require("./routes/referralRoutes")
const userRoutes=require("./routes/userRoutes")

connectDB();

const app=express()
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

app.use("/",authRoutes)
app.use("/",referralRoutes)
app.use("/",userRoutes)

app.use(cors());

app.use('*', async (req, res, next) => {
    return res.status(400).send({
      status: false,
      message: "Routes not found"
    })
  })

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));