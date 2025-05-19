// In-memory config store (could be replaced with Redis)
let config = {
  points: 100,
  duration: 900,
  blockDuration: 900,
};

function getConfig() {
  return { ...config };
}

function updateConfig(newConfig) {
  config = { ...config, ...newConfig };
}

module.exports = { getConfig, updateConfig };
