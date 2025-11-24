import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  listTeams,
  createTeam,
  updateTeam,
  deleteTeam,
  assignEmployeesToTeam,
  unassignEmployeeFromTeam
} from "../controllers/teamController.js";

const router = express.Router();
router.use(authMiddleware);

router.get("/", listTeams);
router.post("/", createTeam);
router.put("/:id", updateTeam);
router.delete("/:id", deleteTeam);

// assign/unassign
router.post("/:teamId/assign", assignEmployeesToTeam); // body: { employeeId } or { employeeIds: [] }
router.delete("/:teamId/unassign", unassignEmployeeFromTeam); // body: { employeeId }

export default router;
