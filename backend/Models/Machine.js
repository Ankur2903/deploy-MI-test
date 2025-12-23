import mongoose from "mongoose";

const { Schema } = mongoose;

const machineSchema = new Schema({
  no: { type: Number, required: true },
  machineId: { type: String, required: true },
  type: { type: String, required: true },
  usableShaftLength: { type: Number, required: true },
  stripWidthMin: { type: Number, required: true },
  stripWidthMax: { type: Number, required: true },
  thicknessMin: { type: Number, required: true },
  thicknessMax: { type: Number, required: true },
  boxPerimeter: { type: Number, required: true },
  giCoating: { type: String, required: true },
  numberOfStations: { type: Number, required: true },
});

const MachineModel = mongoose.model("machines", machineSchema);

export default MachineModel;
