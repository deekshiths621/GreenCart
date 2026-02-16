import jwt from 'jsonwebtoken';

const authUser = async (req, res, next)=>{
    const {token} = req.cookies;
    
    console.log("authUser middleware - token:", token ? "exists" : "missing");

    if(!token){
        return res.json({ success: false, message: 'Not Authorized' });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)
        console.log("Decoded token:", tokenDecode);
        if(tokenDecode.id){
            // Initialize req.body if it doesn't exist
            if (!req.body) {
                req.body = {};
            }
            req.body.userId = tokenDecode.id;
            console.log("UserId set to:", tokenDecode.id);
        }else{
            return res.json({ success: false, message: 'Not Authorized' });
        }
        next();

    } catch (error) {
        console.log("authUser error:", error.message);
        res.json({ success: false, message: error.message });
    }
}

export default authUser;