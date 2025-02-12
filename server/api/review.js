const router = require("express").Router();
const { prisma } = require("../db");

/* Create review */

router.post("/item/:id", async (req, res, next) => {
    try {
        const item = await prisma.Item.update({
                where: {
                    id: Number(req.params.id)
                },
                data: {
                    review: {
                        create: {                       
                            rating: Number(req.body.rating),
                            text: req.body.text,
                            userId: Number(req.body.userId)                       
                        }
                    }
                },
                include: {
                    review: true
                }
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

router.put("/:id", async (req, res, next) => {
    try {
        const review = await prisma.Review.update({
                where: {
                    id: Number(req.params.id)
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

router.delete("/:id", async (req, res, next) => {
    try {
        const review = await prisma.Review.delete({
            where: {
                id: Number(req.params.id)
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