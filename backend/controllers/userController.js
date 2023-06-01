import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'

import { uuid } from 'uuidv4';
import connectDB from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';




import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
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

  const q = query(collection(db, "users"), where("email", "==", email));
  const docs = await getDocs(q);

  if (docs.docs.length > 0) {
    const user = docs.docs[0].data();
    const hashedPassword = user.password;

    bcrypt.compare(password, hashedPassword, async function(err, result) {
      if (result) {
        console.log("Password matched!");
        console.log(user);

        const x = query(collection(db, "projects"), where("email", "==", user.email));
        const projectsref = await getDocs(x);
      
        if (projectsref.docs.length > 0) {
          const projects = projectsref.docs.map((doc) => doc.data());
          console.log('Projects:', projects);

          const token = generateToken(user.uid); // Assuming generateToken is a function that generates a token using the user's UID.
          res.json({ user, projects, token });
        } else {
          const token = generateToken(user.uid);
          res.json({ user, token });
        }
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
  const user = await User.findById(req.user._id)

  if (user) {
    res.json({
      _id: user._id,
      firstName: user.firstName,
      secondName:user.secondName,
      profile_pic:user.profile_pic,
      userLocation:user.userLocation,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  console.log("user is ",req.body)
  if (user) {
    user.firstName = req.body.firstName || user.firstName
    user.secondName = req.body.secondName || user.secondName
    user.profile_pic = req.body.profile_pic || user.profile_pic


    user.email = req.body.email || user.email
    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      secondName: updatedUser.secondName,
      profile_pic:updatedUser.profile_pic,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

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
    
  const  email  = req.params.email;
  console.log("email is ",email)
  const q = query(collection(db, "users"), where("email", "==",email));
  const docs = await getDocs(q);

  if (docs.docs.length > 0) {
    const user = docs.docs[0].data();
    const x = query(collection(db, "projects"), where("email", "==", user.email));
    const projectsref = await getDocs(x);
  
    if (projectsref.docs.length > 0) {
      const projects = projectsref.docs.map((doc) => doc.data());
      console.log('Projects:', projects);
      res.json({user,projects});
    }
  else{
    res.json(user);
  }
  }  } catch (error) {
    
  }
  

 
})

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.isAdmin = req.body.isAdmin

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

export {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
}
