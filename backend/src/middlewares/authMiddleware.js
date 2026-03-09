import jwt from 'jsonwebtoken';

const validateToken = (req, res, next) => {
        
    let token;
    const authHeader = req.headers.authorization;

    if(authHeader && authHeader.startsWith("Bearer ")){
        token = authHeader.split(" ")[1];
    

        if(!token){
            return res.status(401).json({
                message : "No token! Authorization denied"
            })
        }

        try{
            const decode = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
            req.user = decode;
            console.log("Decoded user is :" ,req.user);
            next();
        }
        catch(error){
            return res.status(400).json({message : "Token is invalid"});
        }

    }else {
        return res.status(401).json({
            message : "No token, authorization denied "
        });
    }
}

export default validateToken;