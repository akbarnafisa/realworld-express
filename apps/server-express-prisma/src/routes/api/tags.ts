import { Router } from "express";
import { getTags } from "../../controller/tagsController";

const router = Router();

router.get("/", getTags);

export default router;