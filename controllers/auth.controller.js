import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';
import jwt from 'jsonwebtoken';

export const register = async(req, res) => {
    //db operations
    const { username, email, password } = req.body;
    
    try{
        //hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create a new user and save user to the database
        const newUser = await prisma.user.create({
            data: { username, email, password: hashedPassword }
        })
        res.status(201).json({message:"User created successfully"})
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Failed to create user"})
    }
}
export const login = async(req, res) => {
    //db operations
    const { username, password } = req.body;

    try{
        //chk if the user exists
        const user = await prisma.user.findUnique({
            where: { username },
          });
    
        if (!user) return res.status(400).json({ message: "Invalid Credentials!" });
    
        // CHECK IF THE PASSWORD IS CORRECT
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid)
        return res.status(400).json({ message: "Invalid Credentials!" });
    
       
    // GENERATE COOKIE TOKEN AND SEND TO THE USER

    // res.setHeader("Set-Cookie", "test=" + "myValue").json("success")
    const age = 1000 * 60 * 60 * 24 * 7;

    const token = jwt.sign(
      {
        id: user.id,
        isAdmin: false,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age }
    );

    const { password: userPassword, ...userInfo } = user;
    
    const cookie = res
      .cookie("token", token, 
        {
            httpOnly: true,
            // secure:true,//for production true
            maxAge: age,
            withCredentials: true,
            // sameSite: "none",
        }
        )
      .status(200)
      .json(userInfo);
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Failed to login"})
    }
}
export const logout = (req, res) => {
    res.clearCookie("token").status(200).json({message: "Logout Successful"})
}