
// Create a new project
const createProject = async (req, res) => {
  try {

    console.log("project is ",req.body)
    
   
    
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

export { createProject, getAllProjects, getProjectById, deleteProject, updateProject };
