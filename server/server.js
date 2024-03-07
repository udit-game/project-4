const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const User = require('./models/userModel');



const app = express();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Define the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Define how the file will be named
  }
});

const upload = multer({ storage: storage });


// Use CORS middleware
app.use(cors({
  origin: ['http://localhost:3000', "http://localhost:8000"]
}));
app.use(express.json({limit: '10mb'}));

const connectDB = asyncHandler(async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/project3");
        console.log("database successfully connected");
    } catch (e) {
        console.log(e)
        }
    }
);
connectDB();

app.get("/", asyncHandler(async (req, res)=>{
    res.json({
        "body": "hello"
    })
}));

app.post('/Signup', asyncHandler(async (req, res) => {
  const { name, email, password, profilePicture } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      picture: profilePicture ? profilePicture : undefined,
    });
    await newUser.save();
    const token = jwt.sign({id: newUser._id}, 'spiderman', { expiresIn: '1d' });

    res.status(200).json({
            token: token,
        });
    console.log("registered")
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}));


app.post('/Login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if(user){
    if(user.matchPassword(password)) {
        console.log("logged in");
        // noinspection JSCheckFunctionSignatures
        res.status(200).json({
            token: jwt.sign({id: user._id }, 'spiderman', { expiresIn: '1d' })
        });
    }else {
        res.status(401);
        throw new Error("Invalid password");
    }
    } else {
        res.status(401);
        throw new Error("Invalid id or password");
    }
}));


app.post('/verify-token',  asyncHandler(async (req, res) => {
  const { token } = req.body;

  jwt.verify(token, "spiderman", async (err, decoded) => {
      if (err) {
          return res.status(401).json({message: 'Invalid token'});
      }

      const user_id = decoded.id;
      const user = await User.findOne({_id: user_id}); // Corrected query

      if (!user) {
          console.log("User not found");
          return res.status(401).json({message: 'User not found'});
      }
      // Respond with user information
      res.status(200).json(user);
  });
}));



app.listen(8080, () => {
  console.log(`http://localhost:8080`);
});


