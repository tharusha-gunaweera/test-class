const User = require('../Model/UserModel');
const bcrypt = require('bcryptjs');

//user display 
const getAllUsers = async(request,response,next) => {
    let Users;

    try{
        Users = await User.find();
    }catch(err){
        console.log(err);
    }

    if(!Users){
        return response.status(404).json({message:"User not found"})
    }

    return response.status(200).json({ Users });
};

// Login controller
const login = async (request, response, next) => {
    console.log('Login request received');
    console.log('Request body:', request.body);
    
    const { username, password, acclevel } = request.body;
  
    try {
      console.log('Processing login for:', { username, acclevel });
      
      // Find user by either username or email
      const user = await User.findOne({
        $or: [
          { username: username },
          { email: username }
        ]
      });
  
      console.log('Database query result:', user);
  
      if (!user) {
        console.log('User not found in database');
        return response.status(401).json({
          message: "Invalid username or email",
          debug: {
            searchedValue: username
          }
        });
      }
  
      // Check access level
      if (Array.isArray(acclevel)) {
        console.log('Checking admin access levels:', { userAcclevel: user.acclevel, requestedAcclevel: acclevel });
        // For admin login, check if user has either level 2 or 3
        if (!acclevel.includes(user.acclevel)) {
          console.log('Access level check failed');
          return response.status(401).json({
            message: "Invalid access level",
            debug: {
              userAcclevel: user.acclevel,
              requestedAcclevel: acclevel
            }
          });
        }
      } else {
        console.log('Checking regular access level:', { userAcclevel: user.acclevel, requestedAcclevel: acclevel });
        // For regular login, check exact match
        if (user.acclevel !== Number(acclevel)) {
          console.log('Access level check failed');
          return response.status(401).json({
            message: "Invalid access level",
            debug: {
              userAcclevel: user.acclevel,
              requestedAcclevel: acclevel
            }
          });
        }
      }
  
      // Compare password with hashed password
      console.log('Checking password match');
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        console.log('Password check failed');
        return response.status(401).json({ message: "Invalid password" });
      }
  
      console.log('Login successful, creating response');
      // Create response object without password
      const userResponse = {
        _id: user._id,
        username: user.username,
        email: user.email,
        acclevel: user.acclevel
      };

      console.log("acc level is:" ,userResponse.acclevel);
  
      return response.status(200).json({
        message: "Login successful",
        user: userResponse
      });
  
    } catch (err) {
      console.log("Login error:", err);
      return response.status(500).json({ message: "Server error" });
    }
  };
  

//data insert
const addUsers = async (request, response, next) => {
  const { username, email, school, grade, address, password, acclevel } = request.body;

  let hashedPassword;

  try {
      
      hashedPassword = await bcrypt.hash(password, 10);
  } catch (err) {
      console.log("Password encryption error:", err);
      return response.status(500).json({ message: "Error encrypting password" });
  }

  let users;

  try {
      users = new User({
          username,
          email,
          school,
          grade,
          address,
          password: hashedPassword, 
          acclevel
      });
      await users.save();
  } catch (err) {
      console.log("User creation error:", err);
      return response.status(500).json({ message: "Signup failed, please try again." });
  }

  if (!users) {
      return response.status(400).json({ message: "Unable to insert users" });
  }

  return response.status(201).json({ users });
};

const getById = async(req,res,next) =>{
    const id = req.params.id;

    let user;

    try{
        user = await User.findById(id);
    }catch(err){
        console.log(err);
    }

    if (!user) {
        return res.status(404).json({ message: "User not found" }); 
    }

    return res.status(200).json({ user });
}

//update

const updateUsers = async (req, res, next) => {
    const id = req.params.id;
    const {name,gmail,age,address} = req.body;

    let users;

    try{
        users = await User.findByIdAndUpdate(id, {name:name,gmail:gmail, age:age, address:address});

        users = await users.save();
    }catch(err){
        console.log(err);
    }

    if (!users) {
        return res.status(404).json({ message: "Unable to update user" }); 
    }

    return res.status(200).json({ users });
}

const getByUsername = async (req, res, next) => {
    const username = req.params.username;

    let user;

    try {
        user = await User.find({ username: username });
    } catch (err) {
        console.log(err);
    }

    

    return res.status(200).json({ user });
};

const getByEmail = async (req, res, next) => {
    const email = req.params.email;

    let user;

    try {
        user = await User.find({ email: email });
    } catch (err) {
        console.log(err);
    }

    

    return res.status(200).json({ user });
};


const deleteUser = async (req, res, next) => {
    const id = req.params.id;

    let user;

    try{
        user = await User.findByIdAndDelete(id)
    }catch(err){
        console.log(err);
    }

    if (!user) {
        return res.status(404).json({ message: "Unable to delete user" }); 
    }

    return res.status(200).json({ user });
}


exports.getByEmail = getByEmail;
exports.getByUsername = getByUsername;
exports.getAllUsers = getAllUsers;
exports.addUsers = addUsers;
exports.getById = getById;
exports.updateUsers = updateUsers;
exports.deleteUser = deleteUser;
exports.login = login;