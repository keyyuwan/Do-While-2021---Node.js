import { Router } from "express";

import { AuthenticateUserController } from "./controllers/AuthenticateUserController";
import { CreateMessageController } from "./controllers/CreateMessageController";
import { GetLast3MessagesController } from "./controllers/GetLast3MessagesController";
import { ProfileUserController } from "./controllers/ProfileUserController";

import { ensureAuthenticated } from "./middlewares/ensureAuthenticated";

const router = Router();

// não precisei passar a req, res, pois o express já faz isso pra mim
router.post("/authenticate", new AuthenticateUserController().handle);

router.post(
  "/messages",
  ensureAuthenticated,
  new CreateMessageController().handle
);

router.get("/messages/last3", new GetLast3MessagesController().handle);
router.get("/profile", ensureAuthenticated, new ProfileUserController().handle);

export { router };
