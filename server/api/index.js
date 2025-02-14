const router = require("express").Router();

router.use("/review", require("./review"));
router.use("/item", require("./item"));
// router.use("/comment", require("./comment"));

module.exports = router;