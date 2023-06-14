import asyncHandler from 'express-async-handler'


import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs'
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

// Create a new referral
const createReferal = asyncHandler(async (req, res) => {
  console.log("request body is ", req.body);

  const { referee, firstName, secondName, email } = req.body;
  const q = query(collection(db, "referrals"), where("email", "==", email));

  try {
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      const now = new Date();
      const createdAt = now.toLocaleDateString(); // Convert createdAt to a date string
      const docRef = await addDoc(collection(db, "referrals"), {
        uid: uuidv4(),
        referee,
        firstName,
        secondName,
        email,
        createdAt, // Add the converted createdAt date string
        updatedAt: now, // Add current datetime to updatedAt field
      });

      console.log("doc ref is ", docRef);

      if (docRef) {
        const newUser = {
          uid: docRef.id,
          referee,
          firstName,
          secondName,
          email,
          createdAt, // Include createdAt date string in the response
          updatedAt: now, // Include updatedAt field in the response
        };

        res.status(201).json(newUser);
      } else {
        res.status(400);
        throw new Error('Invalid Customer data');
      }
    } else {
      res.status(404);
      throw new Error('Customer Already Exists');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Get all referrals
const getAllReferals = async (req, res) => {
  try {
    const querySnapshot = await getDocs(collection(db, "referrals"));
    const referrals = querySnapshot.docs.map((doc) => doc.data());
    res.status(200).json(referrals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a referral by ID
const getReferalById = async (req, res) => {
  try {
    const referalUuid = req.params.uuid;
    const q = query(collection(db, "referrals"), where("uid", "==", referalUuid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.docs.length > 0) {
      const referalData = querySnapshot.docs[0].data();
      res.json({ referal: referalData });
    } else {
      res.status(404).json({ error: "No such referal" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a referral by ID
const deleteReferal = async (req, res) => {
  try {
    const referalUuid = req.params.uuid;
    const referalRef = doc(db, "referrals", referalUuid);
    await deleteDoc(referalRef);

    res.json({ message: "Referal deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getReferalByUser = async (req,res)=>{
  try {
    console.log("user referrals")
    const user = req.params.user;
    const x = query(collection(db, "referrals"), where("referee", "==", user));
    const referalsref = await getDocs(x);
    console.log("projecy iser ",referalsref)
    if (referalsref.docs.length > 0) {
      const referrals = referalsref.docs.map((doc) => doc.data());
      console.log('User referrals:', referrals);
      res.json( referrals );
    } else {
      const referrals = []
      res.json( referrals );
      // res.json({ error:"No projects for this user" });
    }
  } catch (error) {
    console.log(error)
  }
 
}


export { createReferal, getAllReferals, getReferalById, deleteReferal,getReferalByUser };
