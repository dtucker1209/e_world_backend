const router = require("express").Router();
const {PrismaClient} = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");



const prisma = new PrismaClient();
const JWT = process.env.JWT;

const getUser = async (id) => {
  const response = await prisma.user.findFirstOrThrow({
    where: {
      id,
    },
  });
  return response;
};

const isLoggedIn = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.slice(7);
  if (!token) return next();
  try {
    const { id } = jwt.verify(token, JWT);
    const user = await getUser(id);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

// Register a new User account
router.post("/register", async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      }
    })

    // Create a token with the User id
    const token = jwt.sign({ id: user.id }, JWT);

    res.status(201).send({ token });
  } catch (error) {
    next(error);
  }
});

// Login to an existing User account
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({where: {username}});

    if (!user) {
      return res.status(401).send("No user found.");
    }

    const isValid = await bcrypt.compare(password, user.password);
    if(!isValid){
      return res.status(401).send("Invalid login credentials.")
    }

    // Create a token with the instructor id
    const token = jwt.sign({ id: user.id }, JWT);

    res.send({ token });
  } catch (error) {
    next(error);
  }
});

// Get the currently logged in instructor
router.get("/me", isLoggedIn, async (req, res, next) => {
  try {
    const user= await prisma.user.findUnique({
      where:{
        id: req.user?.id
      }
    });
    if(!user){
      return res.status(404).send("user not found")
    }
    console.log(user);
    res.send(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
