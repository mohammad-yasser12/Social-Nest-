// import jwt from 'jsonwebtoken';

// export const authMiddleware = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   // Check for the Bearer token in the header
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'No token provided or invalid format' });
//   }

// const token = jwt.sign(
//   { user_id: user._id },
//   process.env.JWT_SECRET,
//   { expiresIn: '7d' },
//   console.log("token", token)
  
// );
  

//   try {
//     // Verify the token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
//     // Attach user data from token to request object
//     // req.user = decoded; // contains { id, iat, exp }

//     // req.user = { _id: decoded.user_id }; 
//     req.user = { user_id: decoded.user_id };


//     console.log(req.user);
    
//      next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Invalid or expired token' });
//   }
// };

// export default authMiddleware;


import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check token format
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided or invalid format' });
  }

  // Extract token
  const token = authHeader.split(' ')[1];
console.log("token",token);

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info
    req.user = { user_id: decoded.user_id };

    console.log("Decoded User:", req.user);
console.log(req.user);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export default authMiddleware;