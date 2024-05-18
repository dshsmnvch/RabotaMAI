import express from "express";
import userAuth from "../middlewares/authMiddleware.js";
import {
  createJob,
  deleteJobPost,
  getJobById,
  getJobPosts,
  updateJob,
} from "../controllers/jobController.js";

const router = express.Router();

//POSTJOB
router.post("/upload-job", userAuth, createJob);

//uPDATEJOB
router.put("/update-job/:jobId", userAuth, updateJob);

//GET-JOBPOST
router.get("/find-jobs", getJobPosts);
router.get("/get-job-detail/:id", getJobById);

//DELETEJOBPOST
router.delete("/delete-job/:id", userAuth, deleteJobPost);

export default router;