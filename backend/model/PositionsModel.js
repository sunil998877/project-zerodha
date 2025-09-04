import { model } from 'mongoose';
import { PositionsSchema } from '../schemas/PositionsSchema.js';

const PositionsModel = model('positions', PositionsSchema);

export default PositionsModel;