const roleHierarchy = {
    admin : 3,
    recruiter : 2,
    user : 1
};

const authorizeRoles =(minimumRole) =>{
    return (req, res, next)=>{

        if(!req.user){
            return res.status(401).json({
                message : "Authentication required"
            });
        } 

        console.log("User role:", req.user.role);
        console.log("Required role:", minimumRole);

        if(roleHierarchy[req.user.role] < roleHierarchy[minimumRole]){
            return res.status(403).json({
                message : "Access denied"
            });
        }

        next();
    }
}
export default authorizeRoles;