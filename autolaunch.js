const { exec } = require('child_process');
const file = require('./config_file.json');

class Launcher {
  constructor(config) {
    this.config = config;
  }
  launchAllToolsOf(project) {
    if (this.config.has(project)) {
      this.config.getToolsOf(project).forEach((tool) => {
        if (tool.path) {
          this._launchToolByNameAndPath(tool.name, tool.path);
        } else {
          this._launchToolByName(tool.name);
        }
      });
      return;
    }
    console.log(`'${project}' not found in config file`);
  }
  _launchToolByName(name) {
    exec(`${name}`, (error) => this._handleLaunch(error, { name }));
  }
  _launchToolByNameAndPath(name, path) {
    exec(`cd ${path} && ${name} .`, (error) =>
      this._handleLaunch(error, { name, path })
    );
  }
  _handleLaunch(error, { name, path = null }) {
    if (error) {
      console.log(`FAILED to launch ${name} at ${path} 💥`);
      return;
    }
    console.log(`${name} launched at ${path} 🚀`);
  }
}

class Config {
  constructor(file) {
    this.file = file;
  }
  has(project) {
    return this.file[project] ? true : false;
  }
  getFirstProjectName() {
    return Object.keys(this.file)[0];
  }
  getToolsOf(project) {
    return this.file[project].tools;
  }
}

/**
 * checkout the link to understand `process.argv`
 * https://www.digitalocean.com/community/tutorials/nodejs-command-line-arguments-node-scripts
 */
const arguments = process.argv;
const config = new Config(file);
const launcher = new Launcher(config);
let project = '';

if (arguments.length > 2) {
  /**
   * if you wondering firstArgumentIndex should be 0
   * then either checkout the link or help me to refactor variable name.
   */
  const firstArgumentIndex = 2;
  project = arguments[firstArgumentIndex];
  launcher.launchAllToolsOf(project);
} else {
  project = config.getFirstProjectName();
  launcher.launchAllToolsOf(project);
}
