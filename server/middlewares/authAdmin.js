import jwt from 'jsonwebtoken';

const authAdmin = async (req, res, next) => {
    try {
        const { adminToken } = req.cookies;

        if (!adminToken) {
            return res.json({ success: false, message: "Not Authorized. Login Again" });
        }

        const decoded = jwt.verify(adminToken, process.env.JWT_SECRET);

        if (decoded.email !== process.env.ADMIN_EMAIL) {
            return res.json({ success: false, message: "Not Authorized. Login Again" });
        }

        next();
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

export default authAdmin;
