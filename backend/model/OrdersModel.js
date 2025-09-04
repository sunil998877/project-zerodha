import { model } from 'mongoose';
import { OrdersSchema } from '../schemas/OrdersSchema.js';

const OrdersModel = model('orders', OrdersSchema);

export default OrdersModel;