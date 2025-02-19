const router = require("express").Router();
const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
const db = require("../db");


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
/* Create review */

router.post("/items/:itemId", isLoggedIn, async (req, res, next) => {
    try {
        const item = await prisma.review.create({
                data: {
                text: req.body.text,
                rating: req.body.rating,
                userId: req.user.id,
                itemId: +req.params.itemId
                },
                
            })
        if (!item) {
            return res.status(404).send("Review not found");
        }
        res.send(item);
    } catch(error) {
        next(error);
    }
});



/* Update a review */

router.put("/:reviewId", isLoggedIn, async (req, res, next) => {
    try {
        const review = await prisma.review.update({
                where: {
                    id: Number(req.params.reviewId),
                    
                },
                data: {                   
                    rating: Number(req.body.rating),
                    text: req.body.text
                }
            })
            

        if (!review) {
            return res.status(404).send("Review not found");
        }
        res.send(review);
    } catch(error) {
        next(error);
    }
});

router.delete("/:reviewId", isLoggedIn, async (req, res, next) => {
    try {
        const review = await prisma.review.delete({
            where: {
                id: Number(req.params.reviewId)
            }
        })
        if (!review) {
            return res.status(404).send("Review not found");
        }
        res.send(review);     
    } catch (error) {
        next(error);       
    }
});

module.exports = router;