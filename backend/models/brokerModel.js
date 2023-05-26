import mongoose from 'mongoose';

const brokerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  regulations: [String],
  servers: [{
    name: {
      type: String,
      required: true,
    },
    ip: {
      type: String,
      required: true,
    },
    port: {
      type: Number,
      required: true,
    },
  }],
});

const Broker = mongoose.model('Broker', brokerSchema);

export default Broker;
