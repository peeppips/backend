import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
  doc,
  deleteDoc,
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

// Create a new broker
const createBroker = async (req, res) => {
  try {
    const { name, country, regulations, servers } = req.body;

    const q = query(collection(db, "brokers"), where("name", "==", name));
    const docs = await getDocs(q);

    if (docs.docs.length === 0) {
      const docRef = await addDoc(collection(db, "brokers"), {
        uid: uuidv4(),
        name, 
        country, 
        regulations, 
        servers
      });

      if (docRef) {
        const createdBroker = {
          uid: docRef.id,
          name, 
          country, 
          regulations, 
          servers
        };
        res.status(201).json(createdBroker);
    }
  }

    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all brokers
const getAllBrokers = async (req, res) => {
  try {
const querySnapshot = await getDocs(collection(db, "brokers"));
const brokers = [];

querySnapshot.forEach((doc) => {
  const broker = doc.data();
  broker.id = doc.id; // Add the document ID to the broker data
  brokers.push(broker);
});

console.log("Brokers are:", brokers);

    res.status(200).json(brokers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a broker by ID
const getBrokerById = async (req, res) => {
  try {
    const {uid} = req.params;
    console.log("broker uid is ",uid)
    const q = query(collection(db, "brokers"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.docs.length > 0) {
      const brokerData = querySnapshot.docs[0].data();
      res.json( brokerData );
    } else {
      res.status(404).json({ error: "No Such Broker" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteBroker = async (req, res) => {
  try {
    const {id} = req.params;
    console.log("uid ",req.params)
    const brokerRef = doc(db, "brokers", id);

     deleteDoc(brokerRef);

    res.json({ message: "Broker deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a broker by ID
const updateBroker = async (req, res) => {
  try {
    const brokerUuid = req.params.uuid;
    const brokerData = req.body; // Assuming the updated broker data is sent in the request body
    
    const brokerRef = doc(db, "brokers", brokerUuid);
    await updateDoc(brokerRef, brokerData);

    res.json({ message: "Broker updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { createBroker, getAllBrokers, getBrokerById, deleteBroker, updateBroker };
