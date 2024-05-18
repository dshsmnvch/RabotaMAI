import mongoose from "mongoose";

import Companies from "../models/companiesModel.js";
export const register = async (req, res, next) => {
    const {name, email, password} = req.body;
    if (!name) {
        next("Введите название компании");
        return;
    }
    if (!email) {
        next("Введите мейл");
        return;
    }
    if(!password) {
        next("Введите пароль");
        return;
        
    }
    try {
        const accountExist = await Companies.findOne({email});
        if (accountExist) {
            next("Вы уже зарегестрированы, войдите в свой аккаунт");
            return;
        }
        
        const company = await Companies.create({
            name,
            email,
            password,
        });

        const token = company.createJWT();

        res.status(201).json({
            success: true,
            message: "Аккаунт вашей компании успешно создан",
            user: {
                _id: company._id,
                name: company.name,
                email: company.email,
            },
            token,
        });
        
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message});
    }

};
export const signIn = async (req, res, next) => {
    const {email, password } = req.body;

    try {
        if (!email || !password){
            next("Введите меил и пароль") ;
            return;
        }
        const company = await Companies.findOne({ email }).select("+password");

        if (!company){
            next("Компания не найдена");
            return;
        }
        const isMatch = await company.comparePassword(password);
        if (!isMatch) {
            next("Неправильный меил или пароль");
            return;
        }
        company.password = undefined;
        const token = company.createJWT();

        res.status(200).json({
            success: true,
            message: "Вы упешно вошли",
            user: company,
            token,
        });

        

    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message});
    }
};

export const updateCompanyProfile = async (req, res, next) => {
    const { name , contact, location, profileUrl, about} = req.body;

    try {
        if (!name|| !location || !about || !contact || !profileUrl) {
            next("Заполните все поля");
            return;
        }

        const id = req.body.user.userId;

            if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).send(`No Company with id: ${id}`);

            const updateCompany = {
                name,
                contact,
                location,
                profileUrl,
                about,
                _id: id,
            };

            const company = await Companies.findByIdAndUpdate(id, updateCompany, {
                new: true,
            });

            const token = company.createJWT();
            company.password = undefined;

        res.status(200).json({
            success: true, 
            message: "Профиль компании успешно обновлен",
            company,
            token,
        });

    } catch (error) {
        console.log(error);
        res.status(404).json({message: error.message});

        
    }

};

export const getCompanyProfile = async (req, res, next) => {
    try {
        const id = req.body.user.userId;
    
        const company = await Companies.findById({ _id: id });
    
        if (!company) {
          return res.status(200).send({
            message: "Компания не найдена",
            success: false,
          });
        }
    
        company.password = undefined;
        res.status(200).json({
          success: true,
          data: company,
        });
      } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
      }
};
//все компании
export const getCompanies = async (req, res, next) => {
    try {
        const { search, sort, location } = req.query;
    
        //условия для фильров 
        const queryObject = {};
    
        if (search) {
          queryObject.name = { $regex: search, $options: "i" };
        }
    
        if (location) {
          queryObject.location = { $regex: location, $options: "i" };
        }
    
        let queryResult = Companies.find(queryObject).select("-password");
    
        // SORTING
        if (sort === "Newest") {
          queryResult = queryResult.sort("-createdAt");
        }
        if (sort === "Oldest") {
          queryResult = queryResult.sort("createdAt");
        }
        if (sort === "A-Z") {
          queryResult = queryResult.sort("name");
        }
        if (sort === "Z-A") {
          queryResult = queryResult.sort("-name");
        }
    
        // PADINATIONS
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
    
        const skip = (page - 1) * limit;
    
        // records count
        const total = await Companies.countDocuments(queryResult);
        const numOfPage = Math.ceil(total / limit);
        // move next page
        // queryResult = queryResult.skip(skip).limit(limit);
    
        // show mopre instead of moving to next page
        queryResult = queryResult.limit(limit * page);
    
        const companies = await queryResult;
    
        res.status(200).json({
          success: true,
          total,
          data: companies,
          page,
          numOfPage,
        });
      } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
      }
    };
//работы компании
export const getCompanyJobListing = async (req, res, next) => {
    const { search, sort } = req.query;
    const id = req.body.user.userId;
  
    try {
      //conditons for searching filters
      const queryObject = {};
  
      if (search) {
        queryObject.location = { $regex: search, $options: "i" };
      }
  
      let sorting;
      //sorting || another way
      if (sort === "Новое") {
        sorting = "-createdAt";
      }
      if (sort === "Старое") {
        sorting = "createdAt";
      }
      if (sort === "А-Я") {
        sorting = "name";
      }
      if (sort === "Я-А") {
        sorting = "-name";
      }
  
      let queryResult = await Companies.findById({ _id: id }).populate({
        path: "jobPosts",
        options: { sort: sorting },
      });
      const companies = await queryResult;
  
      res.status(200).json({
        success: true,
        companies,
      });
    } catch (error) {
      console.log(error);
      res.status(404).json({ message: error.message });
    }
};
//1 компания
export const getCompanyById = async (req, res, next) => {
    try {
        const { id } = req.params;
    
        const company = await Companies.findById({ _id: id }).populate({
          path: "jobPosts",
          options: {
            sort: "-_id",
          },
        });
    
        if (!company) {
          return res.status(200).send({
            message: "Компания не найдена",
            success: false,
          });
        }
    
        company.password = undefined;
    
        res.status(200).json({
          success: true,
          data: company,
        });
      } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
      }
};