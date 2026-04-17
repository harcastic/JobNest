// Utility function to decode JWT and extract user info
export const decodeToken = (token) => {
  try {
    if (!token) return null;
    
    // JWT format: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    // Decode the payload (second part)
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

export const getUserRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  
  const decoded = decodeToken(token);
  return decoded?.role || null;
};

export const isRecruiter = () => {
  const role = getUserRole();
  return role === "recruiter";
};
