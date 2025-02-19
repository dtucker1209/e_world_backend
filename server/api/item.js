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

/* Get all items */

router.get("/", async (req, res, next) => {
  try {

    const items = await prisma.item.findMany();
    if (items.length === 0) {
      console.log("no items found in the table");
    } else {
      console.log("items found", items);
    }
    res.send(items);
  } catch (error) {
    console.error("problem fetching items", error);
    next(error);
  }
});

/* Get item by id */

router.get("/:id", async (req, res, next) => {
  try {
    const item = await prisma.Item.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    if (!item) {
      return res.status(404).send("Item not found.");
    }

    res.send(item);
  } catch (error) {
    next(error);
  }
});

/* Create an item */

router.post("/", isLoggedIn, async (req, res, next) => {
  try {
    const item = await prisma.Item.create({
     
      data: {
        name: req.body.name,
        description: req.body.description,
      },
    });
    if (!item) {
      return res.status(404).send("Item not found");
    }
    res.send(item);
  } catch (error) {
    next(error);
  }
});

/* Update an item */

router.put("/:id", async (req, res, next) => {
  try {
    const item = await prisma.Item.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        name: req.body.name,
        description: req.body.description,
      },
    });
    if (!item) {
      return res.status(404).send("Item not found");
    }
    res.send(item);
  } catch (error) {
    next(error);
  }
});

/* Delete an item */

router.delete("/:id", async (req, res, next) => {
  try {
    const item = await prisma.Item.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    if (!item) {
      return res.status(404).send("Item not found");
    }
    res.send(item);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
