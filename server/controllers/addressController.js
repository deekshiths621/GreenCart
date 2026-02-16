import Address from "../models/Address.js"


// Add Address : /api/address/add
export const addAddress = async(req, res)=>{
    try {
        const { address, userId } = req.body
        await Address.create({...address, userId})
        res.json({success: true, message: "Address added successfully"})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Get Address : /api/address/get
export const getAddress = async(req, res)=>{
    try {
        const { userId } = req.body
        console.log("Getting addresses for userId:", userId);
        const addresses = await Address.find({userId})
        console.log("Found addresses:", addresses.length);
        console.log("Addresses data:", addresses);
        res.json({success: true, addresses})
    } catch (error) {
        console.log("Error in getAddress:", error.message);
        res.json({ success: false, message: error.message });
    }
}

// Delete Address : /api/address/delete
export const deleteAddress = async(req, res)=>{
    try {
        const { addressId, userId } = req.body
        
        if (!addressId) {
            return res.json({ success: false, message: "Address ID is required" });
        }

        // Find the address and verify it belongs to the user
        const address = await Address.findById(addressId);
        
        if (!address) {
            return res.json({ success: false, message: "Address not found" });
        }

        if (address.userId.toString() !== userId) {
            return res.json({ success: false, message: "Unauthorized to delete this address" });
        }

        await Address.findByIdAndDelete(addressId);
        res.json({success: true, message: "Address deleted successfully"})
    } catch (error) {
        console.log("Error in deleteAddress:", error.message);
        res.json({ success: false, message: error.message });
    }
}
