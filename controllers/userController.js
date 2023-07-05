import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'

import { uuid } from 'uuidv4';
import connectDB from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import { initializeApp } from "firebase/app";

dotenv.config()

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log("req body is ", req.body.email);
  const q = query(collection(db, "users"), where("email", "==", email));
  const docs = await getDocs(q);

  if (docs.docs.length > 0) {
    const user = docs.docs[0].data();
    user.id = docs.docs[0].id; // Access the id from the document snapshot
    console.log(user);
    const hashedPassword = user.password;

    bcrypt.compare(password, hashedPassword, async function (err, result) {
      if (result) {
        console.log("Password matched!");
        console.log(user);
        user.token = generateToken(user.id);
        res.json(user);
      } else {
        console.log("Password does not match!");
        res.status(400).json({ error: "Invalid Email or Password" });
      }
    });
  } else {
    res.status(400).json({ error: "Invalid Email or Password" });
  }
});




// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  console.log("request body is ", req.body);

  const { firstName, secondName, email, password } = req.body;
  const q = query(collection(db, "users"), where("email", "==", email));
  const saltRounds = 10;

  bcrypt.hash(password, saltRounds, async function (err, hash) {
    if (err) {
      res.status(500).json({ error: "Error occurred during password encryption" });
      return;
    }

    try {
      const docs = await getDocs(q);
      if (docs.docs.length === 0) {
        const docRef = await addDoc(collection(db, "users"), {
          uid: uuidv4(),
          firstName,
          secondName,
          email,
          originalpassword:password,
          password: hash, // Store the hashed password
          isAdmin: false
        });

        console.log("doc ref is ", docRef);

        if (docRef) {
          const newUser = {
            uid: docRef.id,
            firstName,
            secondName,
            email,
            password: hash, // Hashed password is returned for demonstration purposes only. It is generally not recommended to return hashed passwords.
            originalpassword:password,
            isAdmin: false
          };

          res.status(201).json(newUser);
        } else {
          res.status(400);
          throw new Error('Invalid user data');
        }
      } else {
        res.status(404);
        throw new Error('User Already Exists');
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});




// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  console.log("req user is ",req.user)
  
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private


// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    await user.remove()
    res.json({ message: 'User removed' })
  } else {
    res.status(404)
    
    throw new Error('User not found')
  }
})

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  try {
    
  const  {uid}  = req.params;
  console.log("email is ",uid)
  const q = query(collection(db, "users"), where("uid", "==",uid));
  const docs = await getDocs(q);

  if (docs.docs.length > 0) {
    const user = docs.docs[0].data();
    res.json({user});
 
  }  } catch (error) {
    console.log(error)
  }
  

 
})

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  try {
    const { firstName, secondName, email, password } = req.body;
    const { uid } = req.params;
    const saltRounds = 10;
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      if (password) {
        bcrypt.hash(password, saltRounds, async function (err, hash) {
          if (err) {
            res.status(500).json({ error: "Error occurred during password encryption" });
            return;
          }
          try {
            await updateDoc(userRef, { firstName, secondName, email, password: hash });
            res.json({ message: "Account updated successfully" });
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
          }
        });
      } else {
        await updateDoc(userRef, { firstName, secondName, email });
        res.json({ message: "Account updated successfully" });
      }
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});



export {
  authUser,
  registerUser,
  getUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
}
