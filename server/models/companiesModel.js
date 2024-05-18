import mongoose, { Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from 'jsonwebtoken';


const companySchema = new Schema({
    name: {
        type: String,
        required: [true, "Введите имя компании"],
    },
    email: {
        type: String,
        required: [true, "Введите email"],
        unique: true,
        validate: validator.isEmail
    },
    password: {
        type: String,
        required: [true, "Введите пароль!"],
        minlength: [7, "Пароль должен иметь более 7-ми символов"],
        select: true,
    },
    contact: {type: String },
    location: { type: String},
    profileUrl: {type: String},
    jobPosts: [{ type: Schema.Types.ObjectId, ref: "Jobs"}],
    about: {type: String},
});

companySchema.pre("save", async function(){

    if(!this.isModified) return;

    const salt = await bcrypt.genSalt(10)

    this.password = await bcrypt.hash(this.password, salt);
});

//сравнение пароля
companySchema.methods.comparePassword = async function (userPassword) {
const isMatch = await bcrypt.compare(userPassword, this.password);

return isMatch;
};

//JWT token
companySchema.methods.createJWT =  function(){
return JWT.sign(
    {userId: this._id },
    process.env.JWT_SECRET_KEY, {
        expiresIn: "1d",
    }
);
};



const Companies = mongoose.model("Companies", companySchema);

export default Companies;