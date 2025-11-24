import db from "../models/index.js";
const { Team, Employee, EmployeeTeam, Log } = db;

export const listTeams = async (req, res) => {
  try {
    const orgId = req.organisation_id;
    const teams = await Team.findAll({ where: { organisation_id: orgId } });
    res.json(teams);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const createTeam = async (req, res) => {
  try {
    const orgId = req.organisation_id;
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: "name required" });

    const team = await Team.create({ organisation_id: orgId, name, description });

    await Log.create({
      organisation_id: orgId,
      user_id: req.user.userId,
      action: "team_created",
      meta: { teamId: team.id },
    });

    res.status(201).json(team);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateTeam = async (req, res) => {
  try {
    const orgId = req.organisation_id;
    const { id } = req.params;
    const team = await Team.findOne({ where: { id, organisation_id: orgId } });
    if (!team) return res.status(404).json({ error: "Not found" });

    const { name, description } = req.body;
    await team.update({ name, description });

    await Log.create({
      organisation_id: orgId,
      user_id: req.user.userId,
      action: "team_updated",
      meta: { teamId: team.id },
    });

    res.json(team);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteTeam = async (req, res) => {
  try {
    const orgId = req.organisation_id;
    const { id } = req.params;
    const team = await Team.findOne({ where: { id, organisation_id: orgId } });
    if (!team) return res.status(404).json({ error: "Not found" });

    await team.destroy();

    await Log.create({
      organisation_id: orgId,
      user_id: req.user.userId,
      action: "team_deleted",
      meta: { teamId: id },
    });

    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// assign employees (single or multiple)
export const assignEmployeesToTeam = async (req, res) => {
  try {
    const orgId = req.organisation_id;
    const { teamId } = req.params;
    const { employeeId, employeeIds } = req.body;
    const ids = employeeIds && Array.isArray(employeeIds) ? employeeIds : (employeeId ? [employeeId] : []);

    if (!ids.length) return res.status(400).json({ error: "employeeId or employeeIds required" });

    // verify team exists in org
    const team = await Team.findOne({ where: { id: teamId, organisation_id: orgId } });
    if (!team) return res.status(404).json({ error: "Team not found" });

    // verify employees and create entries
    const created = [];
    for (const id of ids) {
      const emp = await Employee.findOne({ where: { id, organisation_id: orgId } });
      if (!emp) continue; // skip invalid
      // create join if not exists
      const [row, createdFlag] = await EmployeeTeam.findOrCreate({
        where: { employee_id: id, team_id: teamId },
        defaults: { assigned_at: new Date() },
      });
      if (createdFlag) created.push(id);
      // log per assign
      await Log.create({
        organisation_id: orgId,
        user_id: req.user.userId,
        action: "assigned_employee_to_team",
        meta: { employeeId: id, teamId },
      });
    }

    res.json({ assigned: created });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const unassignEmployeeFromTeam = async (req, res) => {
  try {
    const orgId = req.organisation_id;
    const { teamId } = req.params;
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({ error: "employeeId required" });
    }

    // Check team exists
    const team = await Team.findOne({ 
      where: { id: teamId, organisation_id: orgId }
    });
    if (!team) return res.status(404).json({ error: "Team not found" });

    // Check employee belongs to org
    const employee = await Employee.findOne({
      where: { id: employeeId, organisation_id: orgId }
    });
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Check assignment exists
    const assignment = await EmployeeTeam.findOne({
      where: { employee_id: employeeId, team_id: teamId }
    });

    if (!assignment) {
      return res.status(400).json({
        error: "Employee is NOT assigned to this team"
      });
    }

    // Delete assignment
    await assignment.destroy();

    // Log
    await Log.create({
      organisation_id: orgId,
      user_id: req.user.userId,
      action: "unassigned_employee_from_team",
      meta: { employeeId, teamId }
    });

    res.json({ message: "Employee unassigned successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

