const router = require("express").Router();
const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
const db = require("../db");
const jwt = require("jsonwebtoken");
const axios = require("axios");

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

//   const fetchItemDetails = async (itemId) => {
//     try{
//     const response = await fetch(`https://fakestoreapi.com/products/${itemId}`);
//     if (!response.ok) {
//       throw new Error("Failed to fetch item details");
//   }
//     const data = await response.json();
//     return data;  // Assuming the API returns an object with item details
// }catch (error){
//   console.error("Error fetching item details", error);
//   throw error;
// }
//   };
  
  // module.exports = fetchItemDetails;

// Get ALL ITEMS IN CART:
router.get("/", isLoggedIn, async (req, res, next) => {
    try {
        const userId = req.user.id;
        // const itemId= req.body.id;

       if (!userId) {
          return res.status(400).json({ message: 'User ID is required' });
        }
  
      const cart = await prisma.cart.findUnique({
        where:{userId: userId},
        include:{items:true},
      });
      if (!cart) {
       return res.status(200).json({items:[]}); //Empty Cart is valid
      }
      if (cart.items.length ===0) {
        return res.status(200).json({items:[]}); //No items in the cart
       }
       console.log("cart data", cart);
       
      res.send(cart);
    } catch (error) {
      console.error("problem fetching items in your cart", error);
      next(error);
    }
  });

// ADD Items to Cart:
  router.post("/add/:itemId", isLoggedIn, async (req, res, next) => {
    try {

        const itemId= +req.params.itemId;
        const userId = req.user.id;

        if (!itemId) {
            return res.status(400).send("Item Id is required");
        }
        //checking if user has a cart
        let cart = await prisma.cart.findUnique({
          where: {userId},
          include: {items:true},
        });
        //Creates a cart if it doesn't exist
        if(!cart){
          cart= await prisma.cart.create({
            data:{userId}
          });
        }
        //  Check if the item is already in the cart
        // const existingCartItem = cart.item.find(item => item.itemId===itemId);
        // if(existingCartItem){
        //   return res.status(400).json({ message:'Item is already in your Cart'});
        // }

        // get item details from the item table
      const item = await prisma.item.findUnique({
        where:{id:itemId},
      });
        if(!item){
            return res.status(404).send("Item not found.");
        }
        //add item to the cart
        const newCartItem = await prisma.cartItem.create({
          data:{
            cartId: cart.id,
            itemId: item.id,
            price:item.price,
            itemTitle: item.title,
            itemImage: item.image
          },
        });
         // Find or create the user's cart
  

    res.status(200).json({ message: "Item added to cart successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding item to cart" });
  }
});

router.delete("/item/:itemId", isLoggedIn, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const itemId = req.params.itemId;  // Get itemId from the URL parameter

    // Step 1: Find the user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId: userId },
      include: { items: true },  // Include cart items
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    // Step 2: Find the specific cart item
    const cartItem = await prisma.cartItem.findUnique({
      where: {
        cartId_itemId: {
          cartId: cart.id,
          itemId: +itemId, 
        },
      },
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in your cart." });
    }

    // Step 3: Delete the cart item from the database
    await prisma.cartItem.delete({
      where: {
        id: cartItem.id,  // Use the cartItem's unique ID to delete it
      },
    });

    res.status(200).json({ message: "Item removed from cart." });
  } catch (error) {
    console.error("Problem deleting item from cart", error);
    next(error);
  }
});

module.exports = router;