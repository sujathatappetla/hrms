import db from "../models/index.js";
const { Employee, Log } = db;

// list all employees for org
export const listEmployees = async (req, res) => {
  try {
    const orgId = req.organisation_id;
    const employees = await Employee.findAll({ where: { organisation_id: orgId } });
    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getEmployee = async (req, res) => {
  try {
    const orgId = req.organisation_id;
    const id = req.params.id;
    const employee = await Employee.findOne({ where: { id, organisation_id: orgId } });
    if (!employee) return res.status(404).json({ error: "Not found" });
    res.json(employee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const orgId = req.organisation_id;
    const { first_name, last_name, email, phone } = req.body;
    if (!first_name) return res.status(400).json({ error: "first_name required" });

    const employee = await Employee.create({
      organisation_id: orgId,
      first_name,
      last_name,
      email,
      phone,
    });

    await Log.create({
      organisation_id: orgId,
      user_id: req.user.userId,
      action: "employee_created",
      meta: { employeeId: employee.id },
    });

    res.status(201).json(employee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const orgId = req.organisation_id;
    const id = req.params.id;
    const employee = await Employee.findOne({ where: { id, organisation_id: orgId } });
    if (!employee) return res.status(404).json({ error: "Not found" });

    const { first_name, last_name, email, phone } = req.body;
    await employee.update({ first_name, last_name, email, phone });

    await Log.create({
      organisation_id: orgId,
      user_id: req.user.userId,
      action: "employee_updated",
      meta: { employeeId: employee.id },
    });

    res.json(employee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const orgId = req.organisation_id;
    const id = req.params.id;
    const employee = await Employee.findOne({ where: { id, organisation_id: orgId } });
    if (!employee) return res.status(404).json({ error: "Not found" });

    await employee.destroy();

    await Log.create({
      organisation_id: orgId,
      user_id: req.user.userId,
      action: "employee_deleted",
      meta: { employeeId: id },
    });

    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
