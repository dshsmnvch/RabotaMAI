import mongoose, { mongo } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from 'jsonwebtoken';

const userSchema = new mongoose.Schema ({
    firstName: {
        type: String,
        required: [true, "Введите имя!"],
    },
    lastName: {
        type: String,
        required: [true, "Введите фамилию!"],
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
    accountType: {type: String, default: "seeker"},
    contact: {type: String },
    location: { type: String},
    profileUrl: {type: String},
    jobTitle: { type: String},
    about: {type: String},
},
{timestamps: true }


);


userSchema.pre("save", async function(){

        if(!this.isModified) return;

        const salt = await bcrypt.genSalt(10)

        this.password = await bcrypt.hash(this.password, salt);
});

//сравнение пароля
userSchema.methods.comparePassword = async function (userPassword) {
    const isMatch = await bcrypt.compare(userPassword, this.password);

    return isMatch;
};

//JWT token
userSchema.methods.createJWT =  function(){
    return JWT.sign(
        {userId: this._id },
        process.env.JWT_SECRET_KEY, {
            expiresIn: "1d",
        }
    );
};

const Users = mongoose.model("Users", userSchema);

export default Users;