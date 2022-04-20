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
const { findOneAndUpdate } = require("../models/user_Model");
const { attachment } = require("express/lib/response");
const { clear } = require("console");
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
            console.log(`user added: ${phone_number} - ${email} - ${password}`);
            const new_user = new User ({
                name,
                phone_number,
                email,
                password:passwordHash,
            })
            await new_user.save();
            
            const unique_string = uuidv4() + new_user._id;
            const hashed_unique_string = await bcrypt.hash(unique_string, 10);
            const current_url = `${req.protocol}://${req.get("host")}/`;
            const confirm_url = current_url + "api/customer/verify/" + new_user.id + "/" + unique_string;


            const new_verification = new User_Verification({
                user_id: new_user._id,
                unique_string: hashed_unique_string,
                creare_date: Date.now(),
                expried_time: Date.now() + 3*60*1000,
            });

            await new_verification.save();
            var s_url = `<h2>Confirm verification email!</h2>
            <a href="${confirm_url}">Click here!</a> to verification your email</p>
            <h4>contact us</h4>`
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

    verify_email: async (req, res) => {
        try {
            const {user_id, unique_string} = req.params;
            const verified_check = User_Verification.findOne({user_id});

            if (!verified_check) {
                const expried_at = verified_check.expried_at;
                const hashed_uniqe_string = verified_check.unique_string;
                console.log(user_id, unique_string)
                if (expried_at < Date.now()) {
                    await User_Verification.deleteOne({user_id});
                    await User.deleteOne({_id:user_id});

                    return res.status(400).json({
                        success: false,
                        msg: "Link has expried, please register again!"
                    });
                } else {
                    const is_match = bcrypt.compare(unique_string, hashed_uniqe_string);
                    if (is_match) {
                        await User.findOneAndUpdate({_id:user_id}, {verifyEmail:true});
                        await User_Verification.deleteOne({user_id});

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
            }
        } catch (err) {
            console.log("catch error")
            return res.status(400).json({
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
                return res.status(400).json({
                    success:false,
                    msg: "Username does not exits!"
                })
            const passwordCompare = await bcrypt.compare(password, user.password);
            if (!passwordCompare)
                return res.status(400).json({
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
            res.status(201).json({
                success:true,
                access_token,
                msg: "Login successful!"
            })
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
    
});

module.exports = UserController;