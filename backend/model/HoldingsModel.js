import { model } from 'mongoose';
import { HoldingSchema } from '../schemas/HoldingSchema.js';

const HoldingsModel = model('holdings', HoldingSchema);

export default HoldingsModel;