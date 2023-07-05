import asyncHandler from 'express-async-handler'


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
  deleteDoc,
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
    const referralsQuerySnapshot = await getDocs(collection(db, "referrals"));
    const referrals = [];

    if (referralsQuerySnapshot.docs.length > 0) {
      referralsQuerySnapshot.forEach((referralDoc) => {
        const referral = referralDoc.data();
        referral.id = referralDoc.id; // Add the document ID to the referral data
        referrals.push(referral);
      });

      const accountsQuerySnapshot = await getDocs(collection(db, "accounts"));
      const accounts = [];

      accountsQuerySnapshot.forEach((accountDoc) => {
        const account = accountDoc.data();
        account.id = accountDoc.id; // Add the document ID to the account data
        accounts.push(account);
      });

      const populatedReferrals = referrals.map((referral) => {
        referral.accounts = accounts.filter((account) => account.user === referral.uid);
        return referral;
      });

      res.status(200).json(populatedReferrals);
    } else {
      console.log("No referrals found");
      res.json(referrals);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Get a referral by ID
const getReferalById = async (req, res) => {
  try {
    const referalUuid = req.params.uid;
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
    const {id} = req.params;
    console.log("id is ",id)
    const accountRef = doc(db, "referrals", id);
    await deleteDoc(accountRef);
    res.json({ message: "Referral deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getReferalByUser = async (req, res) => {
  try {
    console.log("User referrals");
    const { user } = req.params;

    const referralsQuery = query(collection(db, "referrals"), where("referee", "==", user));
    const querySnapshot = await getDocs(referralsQuery);
    const referrals = [];

    if (querySnapshot.docs.length > 0) {
      querySnapshot.forEach((doc) => {
        const referral = doc.data();
        referral.id = doc.id; // Add the document ID to the referral data
        referrals.push(referral);
      });

      const accountsQuery = query(collection(db, "accounts"), where("user", "in", referrals.map((referral) => referral.uid)));
      const accountsSnapshot = await getDocs(accountsQuery);
      const accounts = [];

      accountsSnapshot.forEach((doc) => {
        const account = doc.data();
        account.id = doc.id; // Add the document ID to the account data
        accounts.push(account);
      });

      const populatedReferrals = referrals.map((referral) => {
        referral.accounts = accounts.filter((account) => account.user === referral.uid);
        return referral;
      });

      res.status(200).json(populatedReferrals);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred" });
  }
};


const updateReferral = async (req, res) => {
  try {
   
    const {id} = req.params;
  
    const referralRef = doc(db, "referrals", id);
    const referralDoc = await getDoc(referralRef);

    if (referralDoc.exists()) {
      await updateDoc(referralRef,req.body);

      res.json({ message: "Account updated successfully" });
    } else {
      res.status(404).json({ error: "No such account" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export { createReferal, getAllReferals, getReferalById, deleteReferal,getReferalByUser,updateReferral };
