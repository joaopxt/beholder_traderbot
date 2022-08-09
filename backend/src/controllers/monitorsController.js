const monitorsRepository = require("../repositories/monitorsRepository");

async function startMonitor(req, res, next) {
  const id = req.params.id;
  const monitor = await monitorsRepository.getMonitor(id);
  if (monitor.isActive) return res.sendStatus(204);
  if (monitor.isSystemMon)
    return res.status(403).send("You can't start or stop the system monitors");

  //start no monitor

  monitor.isActive = true;
  await monitor.save();
  res.json(monitor);
}

async function stopMonitor(req, res, next) {
  const id = req.params.id;
  const monitor = await monitorsRepository.getMonitor(id);
  if (!monitor.isActive) return res.sendStatus(204);
  if (monitor.isSystemMon)
    return res.status(403).send("You can't start or stop the system monitors");

  //stop no monitor

  monitor.isActive = false;
  await monitor.save();
  res.json(monitor);
}

async function getMonitor(req, res, next) {
  const id = req.params.id;
  const monitor = await monitorsRepository.getMonitor(id);
  res.json(monitor);
}

async function getMonitors(req, res, next) {
  const page = req.query.page;
  const monitors = await monitorsRepository.getMonitors(page);
  res.json(monitors);
}

async function insertMonitor(req, res, next) {
  const newMonitor = req.body;
  const savedMonitor = await monitorsRepository.insertMonitor(newMonitor);

  if (savedMonitor.isActive) {
    //start no monitor
  }
  res.status(201).json(savedMonitor.get({ plain: true }));
}

async function updateMonitor(req, res, next) {
  const id = req.params.id;
  const newMonitor = req.body;

  const currentMonitor = await monitorsRepository.getMonitor(id);
  if (currentMonitor.isSystemMon) return res.sendStatus(403);

  const updatedMonitor = await monitorsRepository.updateMonitor(id, newMonitor);

  if (updateMonitor.isActive) {
    //stop no monitor
    //start no monitor
  } else {
    //stop no monitor
  }

  res.json(updatedMonitor);
}

async function deleteMonitor(req, res, next) {
  const id = req.params.id;
  const currentMonitor = await monitorsRepository.getMonitor(id);
  if (currentMonitor.isSystemMon) return res.sendStatus(403);

  if (currentMonitor.isActive) {
    //stop no monitor
  }

  await monitorsRepository.deleteMonitor(id);
  res.sendStatus(204);
}

module.exports = {
  startMonitor,
  stopMonitor,
  getMonitor,
  getMonitors,
  insertMonitor,
  updateMonitor,
  deleteMonitor,
};
