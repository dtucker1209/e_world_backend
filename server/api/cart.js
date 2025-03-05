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

// Get ALL ITEMS IN CART:
router.get("/", async (req, res, next) => {
    try {
  
      const cart = await prisma.cart.findMany();
      if (cart.length === 0) {
        console.log("There are no items in your cart");
      } else {
        console.log("items found", cart);
      }
      res.send(cart);
    } catch (error) {
      console.error("problem fetching items in your cart", error);
      next(error);
    }
  });

// ADD Items to Cart:
  router.post("/", isLoggedIn, async (req, res, next) => {
    try {
      const cartItem = await prisma.cart.create({
        data: {
            id: req.user.id,
            item:{
                create:[{ name: req.body.name}, {description: req.body.description},
                    {price: req.body.price}],
            },
        },
      });
      if (!cartItem) {
        return res.status(404).send("Item not found");
      }
      res.send(cartItem);
    } catch (error) {
      next(error);
    }
  });

//   Update quantity in cart:
//   router.put("/:id", async (req, res, next) => {
//     try {
//       const cartItem = await prisma.cartItem.update({
//         where: {
//           id: Number(req.params.cartItem.id),
//         },
//         data: {
//           quantity: req.body.quantity
//         },
//       });
//       if (!cartItem) {
//         return res.status(404).send("cartItem not found");
//       }
//       res.send(cartItem);
//     } catch (error) {
//       next(error);
//     }
//   });

  router.delete("/:id", async (req, res, next) => {
    try {
      const cartItem = await prisma.cart.delete({
        where: {
          id: Number(req.params.cart.item.id),
        },
      });
      if (!cartItem) {
        return res.status(404).send("Item not found");
      }
      res.send(item);
    } catch (error) {
      next(error);
    }
  });

  module.exports = router;