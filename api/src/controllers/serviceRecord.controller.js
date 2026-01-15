import ServiceRecord from "../models/ServiceRecord.js";

export const createRecord = async (req, res) => {
  const record = await ServiceRecord.create(req.body);
  res.status(201).json(record);
};

export const getRecords = async (req, res) => {
  const records = await ServiceRecord.findAll();
  res.json(records);
};

export const updateRecord = async (req, res) => {
  await ServiceRecord.update(req.body, {
    where: { RecordNumber: req.params.id }
  });
  res.json({ message: "Service record updated" });
};

export const deleteRecord = async (req, res) => {
  await ServiceRecord.destroy({
    where: { RecordNumber: req.params.id }
  });
  res.json({ message: "Service record deleted" });
};
