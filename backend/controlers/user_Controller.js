const  bcrypt  =  require("bcrypt");
const  jwt  =  require("jsonwebtoken");
const util = require('../utils/util')
const User = require('../models/user_Model')
const contant = require('../configs/contant')
const dotenv = require('dotenv');
dotenv.config();

const UserController = ({
    register: async (req, res) => {
        try {
            var {name, phone_number, email, password, cfm_password} = req.body;
            console.log('add user: ', phone_number, email, password);
            const user = await User.findOne({phone_number, email});
            if (await User.findOne({phone_number}))
                return res.json({
                    status : 400,
                    success : false,
                    msg : 'Phone numbers are already exists!'
                });
            if (await User.findOne({email}))
                return res.json({
                    status : 400,
                    success : false,
                    msg : 'Email is already exists!'
                });   
            if (password.length < 6) 
                return res.json({
                    status : 400,
                    success : false,
                    msg : 'The password is required at least 6 characters!'
                });

            const passwordHash = await bcrypt.hash(password, 10);
            console.log(`user ${phone_number} ${email} added!`);
            const newUser = new User ({
                name,
                phone_number,
                email,
                password:passwordHash,
            })
            await newUser.save();
            if (await User.findOne({email}))
                return res.json({
                    status: 201,
                    success: true,
                    msg: 'Register successful!',
                })
            
        } catch (err) {
            return res.json({
                status: 400,
                success: false,
                msg: err.message,
            });
        }
    },

    login: async (req, res) => {
        try {
            const {phone_number, password} = req.body;
            const user = await User.findOne({phone_number: phone_number, role:0})
            if (!user)
                return res.json({
                    status: 400,
                    success:false,
                    msg: "Username does not exits!"
                })
            const passwordCompare = await bcrypt.compare(password, user.password);
            if (!passwordCompare)
                return res.json({
                    status: 400,
                    success:false,
                    msg: "Invalid password!"
                })
            
            const access_token = util.createAccessToken({id:user._id});
            const refresh_token = util.createRefreshToken({id:user._id});
            res.cookie("refreshtoken",
                        refresh_token,
                        {
                            httpOnly: true,
                            path:'/api/auth/refresh_token',
                            maxage: contant._7_day
                        });
            console.log(`${user.name} is singed!`)
            res.status(200).json({
                status: 201,
                success:true,
                access_token,
                msg: "Login successful!"
            })
        } catch (err) {
            return res.json({
                status: 400,
                success: false,
                msg: err.message,
            });
        }
    },

    logout: async (req, res) => {
        try {
            res.clearCookie("refreshtoken", {
                path: "/api/auth/refresh_token",
              });
            
            return res.status(200).json({
                status: 200,
                success: true,
                msg: "Logged out success",
            });
        } catch (err) {
            return res.json({
                status: 400,
                success:false,
                msg: err.message,
            });
        }
    },
    
});

module.exports = UserController;