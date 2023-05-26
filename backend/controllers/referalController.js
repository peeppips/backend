import Referal from './referalModel';

// Create a new referral
const createReferal = async (req, res) => {
  try {
    const { referee, name, project, email, paymentDetails } = req.body;

    const referal = new Referal({
      referee,
      name,
      project,
      email,
      paymentDetails,
    });

    const createdReferal = await referal.save();
    res.status(201).json(createdReferal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all referrals
const getAllReferals = async (req, res) => {
  try {
    const referals = await Referal.find();
    res.status(200).json(referals);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a referral by ID
const getReferalById = async (req, res) => {
  try {
    const referalId = req.params.id;
    const referal = await Referal.findById(referalId);
    if (!referal) {
      res.status(404).json({ error: 'Referral not found' });
      return;
    }
    res.status(200).json(referal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a referral by ID
const deleteReferal = async (req, res) => {
  try {
    const referalId = req.params.id;
    const deletedReferal = await Referal.findByIdAndDelete(referalId);
    if (!deletedReferal) {
      res.status(404).json({ error: 'Referral not found' });
      return;
    }
    res.status(200).json({ message: 'Referral deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a referral by ID
const updateReferal = async (req, res) => {
  try {
    const referalId = req.params.id;
    const { referee, name, project, email, paymentDetails } = req.body;

    const updatedReferal = await Referal.findByIdAndUpdate(
      referalId,
      {
        referee,
        name,
        project,
        email,
        paymentDetails,
      },
      { new: true }
    );

    if (!updatedReferal) {
      res.status(404).json({ error: 'Referral not found' });
      return;
    }
    res.status(200).json(updatedReferal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export { createReferal, getAllReferals, getReferalById, deleteReferal, updateReferal };
