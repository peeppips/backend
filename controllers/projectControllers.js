import dotenv from 'dotenv'
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


// Create a new project
const createProject = async (req, res) => {
  try {
    
    console.log("project is ",req.body)
    const {resellEstimate,botPlatform,uploadedFilePath,status,accounts,name,user} = req.body

    const docRef = await addDoc(collection(db, "projects"),{resellEstimate,botPlatform,uploadedFilePath,status,accounts,name,user});
    console.log("doc ref is ", docRef);
    if (docRef) {
      const newProject = {resellEstimate,botPlatform,uploadedFilePath,status,accounts,name,user}
      res.status(201).json(newProject);
    }
    else {
      res.status(400);
      throw new Error('Invalid Project data');
    }
   
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all projects
const getAllProjects = async (req, res) => {
  try {
    const x = query(collection(db, "projects"));
    const projectRef = await getDocs(x);
    const projects = projectRef.docs.map((doc) => doc.data());
    res.status(200).json(projects);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a project by ID
const getProjectById = async (req, res) => {
  try {
    const projectUuid = req.params.uuid;
    const q = query(collection(db, "projects"), where("uuid", "==", projectUuid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.docs.length > 0) {
      const projectData = querySnapshot.docs[0].data();
      res.json({ project: projectData });
    } else {
      res.status(404).json({ error: "No Such Project" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProjectByUser = async (req,res)=>{
  try {
    const { user } = req.params;
    console.log("user is ",user)
    const q = query(collection(db, "projects"), where("user", "==", user));
    const querySnapshot = await getDocs(q);
    const projects = [];
    if (querySnapshot.docs.length > 0) {
      querySnapshot.forEach((doc) => {
        const project = doc.data();
        project.id = doc.id; // Add the document ID to the broker data
        projects.push(project);
        res.status(200).json(projects);
      });
    } else {
      const accounts = []
      console.log("No accounts for this user accounts")
      res.json(accounts);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
 
}
// Delete a project by ID
const deleteProject = async (req, res) => {
  try {
    const projectUuid = req.params.uuid;
    
    const projectRef = doc(db, "projects", projectUuid);
    await deleteDoc(projectRef);

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a project by ID
const updateProject = async (req, res) => {
  try {
    const {id} = req.params;
    const projectData = req.body; // Assuming the updated broker data is sent in the request body
    
    console.log(projectData)
    const projectRef = doc(db, "projects", id);
    const projectDoc = await getDoc(projectRef, projectData);
    
    if (projectDoc.exists()) {
      await updateDoc(projectRef, projectData);  
  }
  res.json({ message: "Project updated successfully" });

}catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { createProject, getAllProjects, getProjectById, deleteProject, updateProject,getProjectByUser };
