import mongoose from "mongoose";

import Users from "../models/userModel.js";
export const updateUser = async (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        contact,
        location,
        profileUrl,
        jobTitle,
        about,
    } = req.body;

    try {
        if(!firstName || !lastName || !email || !contact || !jobTitle || !about){
            next("Заполните все поля");
        }
        const id = req.body.user.userId;
    
        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).send(`Пользователь с данным ID: ${id} не найден`);
        }
    
        const updateUser = {
            firstName,
            lastName,
            email,
            contact,
            location,
            profileUrl,
            jobTitle,
            about,
            _id: id,
        };
        const user = await Users.findByIdAndUpdate(id, updateUser, {new: true});
    
        const token = user.createJWT();
    
        user.password = undefined;
        res.status(200).json({
            success: true,
            message: 'Пользователь успешно обновлен',
            user,
            token,
        });
     
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message});
        
    }
};


export const getUser = async (req, res, next) => {

    try {
        const id = req.body.user.userId;

        const user = await Users.findById({ _id: id});

        if(!user) {
            return res.status(200).send({
                message: "Пользователь не найден",
                success:false,
            });
        }

        user.password = undefined;
        res.status(200).send({
            success: true,
            user: user,

        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "auth error",
            success: false,
            error: error.message,
        });
        
    }
    
};