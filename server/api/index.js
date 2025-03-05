const router = require("express").Router();

router.use("/review", require("./review"));
router.use("/item", require("./item"));
router.use("/cart", require("./cart"));


module.exports = router;