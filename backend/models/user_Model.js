const mongoose = require('mongoose')
const crypto = require('crypto')

const UserSchema = new mongoose.Schema ({
    name:{
        type: String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    phone_number:{
        type: Number,
        required: true,
    },
    password:{
        type:String,
        required: true,
    },
    verified:{
        type:Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

UserSchema.methods.getResetPasswordToken = function () {
    //! tạo mã thông báo
    const resetToken = crypto.randomBytes(20).toString("hex");
  
    //! Thêm resetPasswordToken vào userSchema
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    // Thời gian hiệu lực 15 phút
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; 
  
    return resetToken;
  };
  
  module.exports = mongoose.model("User", UserSchema);
  