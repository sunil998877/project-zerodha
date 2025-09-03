import { model } from 'mongoose';
import { HoldingSchema } from '../schemas/HoldingSchema.js';

const HoldingsModel = new model('holdings', HoldingSchema);

export default HoldingsModel;