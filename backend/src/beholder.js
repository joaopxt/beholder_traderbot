const MEMORY = {};

let BRAIN = {};

let LOCK_MEMORY = false;

let LOCK_BRAIN = false;

const LOGS = process.env.BEHOLDER_LOGS === "true";

function init(automations) {
  //carregar o BRAIN
}

function updateMemory(symbol, index, interval, value) {
  //symbol: index_interval
  //BTCUSD: RSI_1m
  //BTC: Wallet

  if (LOCK_MEMORY) return;

  const indexKey = interval ? `${index}_${interval}` : index;
  const memoryKey = `${symbol}:${indexKey}`;
  MEMORY[memoryKey] = value;

  if (LOGS)
    console.log(
      `Beholder memory updated: ${memoryKey} => ${JSON.stringify(value)}`
    );

  if (memoryKey === "BTCUSDT:RSI_1m") {
    if (MEMORY[memoryKey].current > 70) {
      //console.log("ENTROU NA CONDIÇÃO");
    }
  }

  //Lógica de processamento do estímulo
}

function getMemory(symbol, index, interval) {
  if (symbol && index) {
    const indexKey = interval ? `${index}_${interval}` : index;
    const memoryKey = `${symbol}:${indexKey}`;

    const result = MEMORY[memoryKey];
    return typeof result === "object" ? { ...result } : result;
  }
  return { ...MEMORY };
}

function flattenObject(ob) {
  let toReturn = {};

  for (let i in ob) {
    if (!ob.hasOwnProperty(i)) {
      continue;
    }

    if (typeof ob[i] === "object" && ob[i] !== null) {
      let flatObject = flattenObject(ob[i]);
      for (let x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;
        toReturn[i + "." + x] = flatObject[x];
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
}

function getEval(prop) {
  if (prop.indexOf(".") === -1) return `MEMORY['${prop}']`;

  const propSplit = prop.split(".");
  const memKey = propSplit[0];
  const memProp = prop.replace(memKey, "");
  return `MEMORY['${memKey}']${memProp}`;
}

function getMemoryIndexes() {
  return Object.entries(flattenObject(MEMORY))
    .map((prop) => {
      const propSplit = prop[0].split(":");
      return {
        symbol: propSplit[0],
        variable: propSplit[1],
        eval: getEval(prop[0]),
        example: prop[1],
      };
    })
    .sort((a, b) => {
      if (a.variable < b.variable) return -1;
      if (a.variable > b.variable) return 1;
      return 0;
    });
}

function getBrain() {
  return { ...BRAIN };
}

function deleteMemory(symbol, index, interval) {
  try {
    const indexKey = interval ? `${index}_${interval}` : index;
    const memoryKey = `${symbol}:${indexKey}`;

    LOCK_MEMORY = true;
    delete MEMORY[memoryKey];

    if (LOGS) console.log(`Beholder memory delete: ${memoryKey}`);
  } finally {
    LOCK_MEMORY = false;
  }
}

module.exports = {
  init,
  updateMemory,
  getMemory,
  getMemoryIndexes,
  getBrain,
  deleteMemory,
};
