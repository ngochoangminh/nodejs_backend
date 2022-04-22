const  bcrypt  =  require("bcrypt");
const  jwt  =  require("jsonwebtoken");
const util = require('../utils/util');
const User = require('../models/user_Model');
const User_Verification = require('../models/user_Verification_Model');
const send_email = require('../utils/send_email');
const path = require('path')
const contant = require('../configs/contant');
const { v4: uuidv4 } = require("uuid");
const dotenv = require('dotenv');

dotenv.config();

const UserController = ({
    register: async (req, res) => {
        try {
            var {name, phone_number, email, password} = req.body;
            // const user = await User.findOne({phone_number, email});

            if (await User.findOne({email}))
                return res.status(400).json({
                    success : false,
                    msg : 'Email is already exists!'
                });
            if (await User.findOne({phone_number}))
                return res.status(400).json({
                    success : false,
                    msg : 'Phone numbers are already exists!'
                });
            if (await User.findOne({email}))
                return res.status(400).json({
                    success : false,
                    msg : 'Email is already exists!'
                });   
            if (password.length < 6) 
                return res.status(400).json({
                    success : false,
                    msg : 'The password is required at least 6 characters!'
                });

            const passwordHash = await bcrypt.hash(password, 10);
            // console.log(`user added: ${phone_number} - ${email} - ${password}`);
            const new_user = new User ({
                name,
                phone_number,
                email,
                password:passwordHash,
            })
            
            await new_user.save();
            
            var unique_string = uuidv4() + new_user._id;
            var hashed_unique_string = await bcrypt.hash(unique_string, 10);
            var current_url = `${req.protocol}://${req.get("host")}/`;
            var confirm_url = current_url + "api/auth/verify/" + new_user.id + "/" + unique_string;


            const new_verification = new User_Verification({
                user_id: new_user._id,
                unique_string: hashed_unique_string,
                create_date: Date.now(),
                expries_time: Date.now() + 1*60*60*1000,
            });

            await new_verification.save();
            var s_url = `<h2>Confirm verification email!</h2>
            <p><a href="${confirm_url}">Click here</a> to verification your email</p>
            <h3>contact us</h3>`

            await send_email({
                from: process.env.SMPT_MAIL,
                to: email,
                subject:`Verifiy your account`,
                template:"confirm-email",
                attachments: [{
                    filename: "verify.png",
                    path: path.resolve("./views", "images", "verify.png"),
                    cid: "verify_logo",
                }],
                context: {confirm_url},
                html: s_url,
            });
            
            return res.status(200).json({
                success: true,
                msg: `Verification email was send to ${email}`,
            });
        } catch (err) {
            return res.status(400).json({
                success: false,
                msg: err.message,
            });
        }
    },

<<<<<<< HEAD
    refresh_token: async (req, res) => {
        try {
            const rf_token = req.cookie.refreshtoken;
            if (!rf_token) {
                return res.status(400).json({
                    msg: 'Please login!',
                });
            } else {
                jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                    if (err) {
                        return res.status(400).json({
                            msg: "Please Login or Register",
                          });
                    } else {
                        const accesstoken = STORAGE.createAccessToken({
                            id: user.id,
                            role: user.role,
                        });
                        res.status(200).json({
                            success: true,
                            msg: "Refresh token is created!",
                            accessToken: accesstoken,
                        });
                    }
                });
            }
            
        } catch (err) {
            return res.status(400).json({
=======
    checkUserExisted: async (req, res) => {
        try {
            const {phone_number} = req.body;
            const user = await User.findOne({phone_number})
            if (!user)
                return res.status(400).json({
                    success : false,
                    msg : 'Phone numbers are not exists!'
                });
            console.log(`${user.name} is existed!`)
            res.status(201).json({
                    success:true,
                    msg: "User is existed"
                })
        }
        catch (err) {
            return res.status(400).json({
                success: false,
>>>>>>> ee1e18bd387122d0682fed854abf8f33eccf5ad6
                msg: err.message,
            });
        }
    },
<<<<<<< HEAD
=======

>>>>>>> ee1e18bd387122d0682fed854abf8f33eccf5ad6
   
    login: async (req, res) => {
        try {
            const {phone_number, password} = req.body;
            const user = await User.findOne({phone_number: phone_number, role:0})
            if (!user)
                return res.status(400).json({
                    success:false,
                    msg: "Username does not exits!",
                })
            const passwordCompare = await bcrypt.compare(password, user.password);
            if (!passwordCompare)
                return res.status(400).json({
                    success:false,
                    msg: "Invalid password!"
                });
            
            const access_token = util.createAccessToken({id:user._id});
            const refresh_token = util.createRefreshToken({id:user._id});
            res.cookie("refreshtoken",
                        refresh_token,
                        {
                            httpOnly: true,
                            path:'/api/auth/refresh_token',
                            maxage: contant._7_day,
                        });
            res.setHeader("Authorization",access_token)
            res.status(201).json({
                success:true,
                accessToken: access_token,
                msg: `Login successful! ${user.name} is singed!`,
            });
        } catch (err) {
            return res.status(400).json({
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
            
            return res.status(201).json({
                success: true,
                msg: "Logged out success",
            });
        } catch (err) {
            return res.status(400).json({
                success:false,
                msg: err.message,
            });
        }
    },
    verify_email: async (req, res) => {
        try {
            const {uid, ustr} = req.params;
            // console.log(typeof uid);
            const check = await User_Verification.findOne({user_id:uid, role:0});
            
            if (typeof check !== 'undefined') {
                // console.log("in if :", check)
                const hashed_ustr = check.unique_string;
                const expries_date = check.expries_time;
                // console.log("expdate and hashstr: ", check.expries_time, expries_date, hashed_ustr);
                if (typeof expries_date !== 'undefined' && typeof hashed_ustr !== 'undefined') {
                    if (Date.now() > expries_date) {
                        await User_Verification.deleteOne({user_id:uid});
                        await User.deleteOne({_id:iud});
    
                        return res.status(400).json({
                            success: false,
                            msg: "Link has expried, please register again!"
                        }); 
    
                    } else {
                        // console.log('>>>>> link is still validated');
                        var is_match = bcrypt.compare(ustr, hashed_ustr);
                        if (is_match) {
                            await User.findOneAndUpdate({_id: uid}, {verified: true});
                            await User_Verification.deleteOne({user_id:uid});
    
                            return res.status(201).json({
                                success: true,
                                msg: "User is verified!",
                            });
    
                        } else {
                            return res.status(400).json({
                                success:false,
                                msg: "Unique string is not match!",
                            });
                        } 
                    }
                }  else {
                    return res.status(400).json({
                        success:false,
                        msg: "expried date or unique string is undefined!",
                    });
                }
                
            } else {
                return res.status(400).json({
                    success:false,
                    msg: "check is not found!",
                });
            }
        } catch (err) {
            return res.status(400).json({
                success: false,
                msg: err.message,
            });
        }
    },
    get_all: async (req,res)=>{
        try {
            var user = await User.find();
            return res.status(201).json({
                user,
                success: true,
                msg: "Successful!"
            });
        } catch (err) {
            return res.status(400).json({
                success: false,
                msg: err.message,
            });
        }
    },
    profile: async (req, res) => {
        try {
            console.log(req.user.id)
            var user = await User.findById(req.user.id).select("-password");
            
            if (!user)
                return res.json({
                    status: 400,
                    success: false,
                    msg: "User does not exist.",
                });
            return res.status(200).json({
                status: 200,
                success: true,
                user,
            });
        } catch (err) {
            return res.status(400).json({
                success:false,
                msg: err.message,
            });
        }
    },
});

module.exports = UserController;