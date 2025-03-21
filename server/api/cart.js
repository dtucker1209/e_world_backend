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

  const fetchItemDetails = async (itemId) => {
    try{
    const response = await fetch(`https://fakestoreapi.com/products/${itemId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch item details");
  }
    const data = await response.json();
    return data;  // Assuming the API returns an object with item details
}catch (error){
  console.error("Error fetching item details", error);
  throw error;
}
  };
  
  module.exports = fetchItemDetails;

// Get ALL ITEMS IN CART:
router.get("/", isLoggedIn, async (req, res, next) => {
    try {
        const userId = req.user.id;
  
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
  router.post("/add", isLoggedIn, async (req, res, next) => {
    try {
        const {userId, itemId}= req.body;
        if (!itemId || !userId) {
            return res.status(400).send("Item Id and UserId are required");
        }
        // Find the item in the item table:
      const itemDetails = await fetchItemDetails(itemId);
        if(!itemDetails){
            return res.status(404).send("Item not found.");
        }
         // Find or create the user's cart
    const userCart = await prisma.cart.upsert({
      where: { userId: userId },
      update: {},
      create: {
        userId: userId,
        items: {
          create: {
            itemId: itemId,
            name: itemDetails.name,
            price: itemDetails.price,
          },
        },
      },
    });
        // Check if the item is already in the cart
    const existingItem = await prismaClient.cartItem.findFirst({
      where: {
        cartId: userCart.id,
        itemId: itemId,
      },
    });

    if (existingItem) {
      return res.status(400).json({ message: "Item already in cart" });
    }

    // If the item is not already in the cart, create a new CartItem
    await prisma.cartItem.create({
      data: {
        cartId: userCart.id,
        itemId: itemId,
        name: itemDetails.name,
        price: itemDetails.price,
      },
    });

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

    // Step 2: Find the specific cart item by the third-party API itemId
    const cartItem = await prisma.cartItem.findUnique({
      where: {
        cartId_itemId: {
          cartId: cart.id,
          itemId: itemId,  // Match the third-party API itemId
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