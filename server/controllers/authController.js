import Users from "../models/userModel.js";

export const register = async (req, res, next) => {
    const {firstName, lastName, email, password } = req.body;
//validator for fields
    if (!firstName) {
        next("Введите имя") ;
    }
    if (!lastName) {
        next("Введите фамилию");
    }
    if (!email) {
        next("Введите email");
    }
    if (!password) {
        next("Введите пароль");
    }

    try {
        const userExists = await Users.findOne({email});

        if(userExists){
            next('Email существует')
            return;
        }

        const user = await Users.create ({
            firstName,
            lastName,
            email,
            password,
        });

        //user token 
        const token = user.createJWT();
    res.status(201).send({
        success: true,
        message: "Аккаунт успещно создан",
    user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        accountType: user.accountType,
    },
    token,
    });
    } catch (error) {
        console.log(error);
        res.status(404).json({message: error.message});
    }
};

export const signIn = async (req, res, next) => {
    const {email, password } = req.body;
    try {
        //validation
        if (!email || !password) {
            next("Введите маил и пароль");
            return;
        }
        //find user by email
        const user= await Users.findOne({ email }).select("+password");

        if(!user) {
            next('Несуществующий маил или пароль');
            return;
        }
        //compare password
        const isMatch = await user.comparePassword(password);
        if(!isMatch) {
            next("Неверный маил или пароль");
            return;
        }

    user.password = undefined;

    const token = user.createJWT();

    res.status(201).json({
        success: true,
        message: "вы успешно вошли",
        user,
        token,
    });
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message});
    }
};
