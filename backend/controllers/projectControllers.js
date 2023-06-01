import dotenv from 'dotenv'
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
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
    const {resellEstimate,botPlatform,broker,server,uploadedFilePath,accountNumber,password,email} = req.body

    const docRef = await addDoc(collection(db, "projects"),{resellEstimate,botPlatform,broker,server,uploadedFilePath,accountNumber,password,email});
    console.log("doc ref is ", docRef);
    if (docRef) {
      const newProject = {resellEstimate,botPlatform,broker,server,uploadedFilePath,accountNumber,password,email}
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
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a project by ID
const getProjectById = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getProjectByUser = async (req,res)=>{
  try {
    
    const userEmail = req.params.userEmail;
    const x = query(collection(db, "projects"), where("email", "==", userEmail));
    const projectsref = await getDocs(x);
    console.log("projecy iser ",projectsref)
    if (projectsref.docs.length > 0) {
      const projects = projectsref.docs.map((doc) => doc.data());
      console.log('User projects:', projects);
        res.json( projects );
    } else {
      res.json({ error:"No projects for this user" });
    }
  } catch (error) {
    console.log(error)
  }
 
}
// Delete a project by ID
const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const deletedProject = await Project.findByIdAndDelete(projectId);
    if (!deletedProject) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.status(200).json({ message: 'Project deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a project by ID
const updateProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const { user, projectType, apiKeyDeriv, mkt, lotSize, stopLoss, takeProfit, name } = req.body;

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      {
        user,
        projectType,
        apiKeyDeriv,
        mkt,
        lotSize,
        stopLoss,
        takeProfit,
        name,
      },
      { new: true }
    );

    if (!updatedProject) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export { createProject, getAllProjects, getProjectById, deleteProject, updateProject,getProjectByUser };
