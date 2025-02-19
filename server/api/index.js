const router = require("express").Router();

router.use("/review", require("./review"));
router.use("/item", require("./item"));


module.exports = router;