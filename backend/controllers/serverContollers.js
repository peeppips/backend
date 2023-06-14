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
  
const createServer = async (req, res) => {
    try {
      const { broker,servers} = req.body;
      created_servers = []
      servers.forEach( async (server) => {
        const docRef = await addDoc(collection(db, "servers"), {
            uid: uuidv4(),
            broker,
            server
          });
    
          if (docRef) {
            const createdServer = {
              uid: docRef.id,
              broker,
              server
            };
            created_servers.push(createdServer)
            res.status(201).json(created_servers);
          }
         else {
          res.status(400).json({ error: "Server Not Created" });
        }
    
      });
      
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  const getServerByBroker = async (req, res) => {
    try {
      const { broker } = req.params;
      const q = query(collection(db, "brokers"), where("name", "==", broker));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.docs.length > 0) {
        const servers = querySnapshot.docs.map((doc) => doc.data());
        res.json({ servers });
      } else {
        res.status(404).json({ error: "No Servers found for the specified user" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
   
  
  const deleteServer = async (req, res) => {
    try {
      const serverUuid = req.params.uuid;
      const serverRef = doc(db, "servers", serverUuid);
      await deleteDoc(serverRef);
  
      res.json({ message: "Server deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
 
  
  export { createServer,getServerByBroker,deleteServer };
  