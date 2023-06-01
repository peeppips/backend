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
    const x = query(collection(db, "brokers"));
    const brokerRef = await getDocs(x);
    const brokers = brokerRef.docs.map((doc) => doc.data());
    res.status(200).json(brokers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a broker by ID
const getBrokerById = async (req, res) => {
  try {
    const brokerId = req.params.id;
    const broker = await Broker.findById(brokerId);
    if (!broker) {
      res.status(404).json({ error: 'Broker not found' });
      return;
    }
    res.status(200).json(broker);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a broker by ID
const deleteBroker = async (req, res) => {
  try {
    const brokerId = req.params.id;
    const deletedBroker = await Broker.findByIdAndDelete(brokerId);
    if (!deletedBroker) {
      res.status(404).json({ error: 'Broker not found' });
      return;
    }
    res.status(200).json({ message: 'Broker deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a broker by ID
const updateBroker = async (req, res) => {
  try {
    const brokerId = req.params.id;
    const { name, country, regulations, servers } = req.body;

    const updatedBroker = await Broker.findByIdAndUpdate(
      brokerId,
      {
        name,
        country,
        regulations,
        servers,
      },
      { new: true }
    );

    if (!updatedBroker) {
      res.status(404).json({ error: 'Broker not found' });
      return;
    }
    res.status(200).json(updatedBroker);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export { createBroker, getAllBrokers, getBrokerById, deleteBroker, updateBroker };
