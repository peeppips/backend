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
  
const createAccount = async (req, res) => {
    try {
      const { login, password, investorPassword, lotSize, riskManagementPercentage, takeProfit, stopLoss,broker,server, user } = req.body;
  
      const q = query(collection(db, "accounts"), where("login", "==", login));
      const docs = await getDocs(q);
  
      if (docs.docs.length === 0) {
        const docRef = await addDoc(collection(db, "accounts"), {
          uid: uuidv4(),
          login,
          password,
          investorPassword,
          lotSize,
          riskManagementPercentage,
          takeProfit,
          stopLoss,
          user,
          broker,
          server
        });
  
        if (docRef) {
          const createdAccount = {
            uid: docRef.id,
            login,
            password,
            investorPassword,
            lotSize,
            riskManagementPercentage,
            takeProfit,
            stopLoss,
            user,
            broker,
            server
          };
          res.status(201).json(createdAccount);
        }
      } else {
        res.status(400).json({ error: "Account with the same login already exists" });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  const getAccountsByUser = async (req, res) => {
    try {
      const { user } = req.params;
      console.log("user is ",user)
      const q = query(collection(db, "accounts"), where("user", "==", user));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.docs.length > 0) {
        const accounts = querySnapshot.docs.map((doc) => doc.data());
        console.log(accounts)
        res.json(accounts);
      } else {
        const accounts = []
        console.log("No accounts for this user accounts")
        res.json(accounts);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
   
  const getAllAccounts = async (req, res) => {
    try {
      const querySnapshot = await getDocs(collection(db, "accounts"));
      const accounts = querySnapshot.docs.map((doc) => doc.data());
      res.status(200).json(accounts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const getAccountByUuid = async (req, res) => {
    try {
      const accountUuid = req.params.uuid;
      const q = query(collection(db, "accounts"), where("uid", "==", accountUuid));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.docs.length > 0) {
        const accountData = querySnapshot.docs[0].data();
        res.json({ account: accountData });
      } else {
        res.status(404).json({ error: "No such account" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  
  const deleteAccount = async (req, res) => {
    try {
      const accountUuid = req.params.uuid;
      const accountRef = doc(db, "accounts", accountUuid);
      await deleteDoc(accountRef);
  
      res.json({ message: "Account deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
 
  
  export { createAccount,getAllAccounts,getAccountByUuid,deleteAccount,getAccountsByUser };
  