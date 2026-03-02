const router = require("express").Router();

const verifyToken = require("../middlewares/auth.middlewares");

// ℹ️ Organize and connect all your route files here.

const authRoutes = require("./auth.routes");
router.use("/auth", authRoutes);

router.get("/example-private-route", verifyToken, (req, res) => {
    console.log("This is the request headers: ", req.headers);

  res.send("This is a private route that only logged in users can see.");
}); 

module.exports = router;
