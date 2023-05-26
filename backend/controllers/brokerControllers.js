import Broker from './brokerModel';

// Create a new broker
const createBroker = async (req, res) => {
  try {
    const { name, country, regulations, servers } = req.body;

    const broker = new Broker({
      name,
      country,
      regulations,
      servers,
    });

    const createdBroker = await broker.save();
    res.status(201).json(createdBroker);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all brokers
const getAllBrokers = async (req, res) => {
  try {
    const brokers = await Broker.find();
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
