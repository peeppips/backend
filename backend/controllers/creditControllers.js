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
  

const createCredit = (async (req, res) => {
    console.log("request body is ", req.body);
  
    const { user, transactionId, project, points } = req.body;
    const q = query(collection(db, "credits"), where("transactionId", "==", transactionId));
  
    try {
      const docs = await getDocs(q);
      if (docs.docs.length === 0) {
        const now = new Date();
        const createdAt = now.toLocaleDateString(); // Convert createdAt to a date string
        const docRef = await addDoc(collection(db, "credits"), {
          uid: uuidv4(),
          user,
          transactionId,
          project,
          points,
          createdAt, // Add the converted createdAt date string
          updatedAt: now, // Add current datetime to updatedAt field
        });
  
        console.log("doc ref is ", docRef);
  
        if (docRef) {
          const newCredit = {
            uid: docRef.id,
            user,
            transactionId,
            project,
            points,
            createdAt, // Include createdAt date string in the response
            updatedAt: now, // Include updatedAt field in the response
          };
  
          res.status(201).json(newCredit);
        } else {
          res.status(400);
          throw new Error('Invalid Credit data');
        }
      } else {
        res.status(404);
        throw new Error('Credit Already Exists');
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  const getAllCredits = async (req, res) => {
    try {
      const querySnapshot = await getDocs(collection(db, "credits"));
      const credits = querySnapshot.docs.map((doc) => doc.data());
      res.status(200).json(credits);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const getCreditByUuid = async (req, res) => {
    try {
      const creditUuid = req.params.uuid;
      const q = query(collection(db, "credits"), where("uid", "==", creditUuid));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.docs.length > 0) {
        const creditData = querySnapshot.docs[0].data();
        res.json({ credit: creditData });
      } else {
        res.status(404).json({ error: "No such credit" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const deleteCredit = async (req, res) => {
    try {
      const creditUuid = req.params.uuid;
      const creditRef = doc(db, "credits", creditUuid);
      await deleteDoc(creditRef);
  
      res.json({ message: "Credit deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const getCreditsByUser = async (req, res) => {
    try {
      const { user } = req.params;
      console.log("user is ", user);
      const q = query(collection(db, "credits"), where("user", "==", user));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.docs.length > 0) {
        const credits = querySnapshot.docs.map((doc) => doc.data());
        console.log(credits);
        res.json(credits);
      } else {
        const credits = [];
        console.log("No credits for this user");
        res.json(credits);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  
  export { createCredit, getAllCredits, getCreditByUuid, deleteCredit,getCreditsByUser };
  