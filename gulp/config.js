const cfg = require('./../config.json');
const themePath = `wp-content/themes/${cfg.themeName}`;

cfg.path = {
  theme: themePath,
  backup: ".backup",
};

module.exports = cfg;