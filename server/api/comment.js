const router = require("express").Router();
const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
const db = require("../db");


module.exports = router;
