const router = require("express").Router();
const userRouter = require("./users");
const { login, creatingUser } = require("../controllers/users");
const {
    AuthenticationBody,
    UserInfoBodyValidation,
} = require("../middlewares/Validation");
const { NotFoundError } = require("../utils/NotFoundError");
const { middleware } = require("../middlewares/auth");

router.use("/users", middleware, userRouter);
router.post("/signin", AuthenticationBody, login);
router.post("/signup", UserInfoBodyValidation, creatingUser);

router.use((req, res, next) => {
    next(new NotFoundError("No Requested resource"));
});

module.exports = router;
