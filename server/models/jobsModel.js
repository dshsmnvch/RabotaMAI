import { application } from "express";
import mongoose, { Schema } from "mongoose";


const jobSchema = new mongoose.Schema({
    company: {type: Schema.Types.ObjectId, ref: "Companies"},
     jobTitle: { type: String, required: [true, "Имя вакансии обязательно"]},
     jobType: { type: String, required: [true, "Тип вакансии обязателен"]},
     location: { type: String, required: [true, "Расположение обязательно"]},
     salary: { type: Number, required: [true, "Укажите зарплату"]},
     vacancies: { type: Number },
     experience: { type: Number, default: 0},
     detail: [{desc: {type: String}, requirements: { type: String}}],
    application: [{ type: Schema.Types.ObjectId, ref: "Users"}],
},{
    timestamps: true
}
);

const Jobs = mongoose.model("Jobs", jobSchema);

export default Jobs;