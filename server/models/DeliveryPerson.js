import mongoose from "mongoose";

const deliveryPersonSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    assignedOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'order' }]
}, { timestamps: true });

const DeliveryPerson = mongoose.models.deliveryperson || mongoose.model('deliveryperson', deliveryPersonSchema);

export default DeliveryPerson;
