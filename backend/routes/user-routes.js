
// import express from "express";
const express = require("express");
// import getAllUser from "../controllers/user-controller";
const {getAllUser , signup, login} = require("../controllers/user-controller")

// import { getAllUser } from "../controllers/user-controller";


const router = express.Router();

router.get('/', getAllUser)
router.post("/signup" , signup)
router.post("/login" , login)

// export default router;
module.exports = router