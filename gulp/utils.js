const fs = require('fs-extra');
const del = require('del');
const prompts = require('prompts');
const clc = require('cli-color');
const clui = require('clui');
const Spinner = clui.Spinner;
const cp = require('child_process');
const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
const path = require('path');

const parseBuffer = (src) => {

  const NEWLINES_MATCH = /\r\n|\n|\r/;
  const NEWLINE = '\n';
  const RE_INI_KEY_VAL = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/;
  const RE_NEWLINES = /\\n/g;
  const obj = {};

  src.toString().split(NEWLINES_MATCH).forEach(line => {

    // matching "KEY" and "VAL" in "KEY=VAL"
    const keyValueArr = line.match(RE_INI_KEY_VAL);
    // matched?
    if (keyValueArr != null) {
      const key = keyValueArr[1];

      // default undefined or missing values to empty string
      let val = (keyValueArr[2] || '');
      const end = val.length - 1;
      const isDoubleQuoted = val[0] === '"' && val[end] === '"';
      const isSingleQuoted = val[0] === "'" && val[end] === "'";

      // if single or double quoted, remove quotes
      if (isSingleQuoted || isDoubleQuoted) {
        val = val.substring(1, end);

        // if double quoted, expand newlines
        if (isDoubleQuoted) {
          val = val.replace(RE_NEWLINES, NEWLINE);
        }
      } else {
        //  remove surrounding whitespace
        val = val.trim();
      }
      obj[key] = val;
    }
  });

  return obj;
}

const getEnv = (env) => {

  let filePath = path.resolve(process.cwd(), `.env.${env}`);
  let envBuffer = fs.readFileSync(filePath);
  let creds = parseBuffer(envBuffer);

  return creds;
}

const onError = {
  errorHandler: require('gulp-notify').onError({ message: "Error: <%= error.message %>" })
}

// Messages in console
const log = {
  simple: (msg) => {
    console.log(clc.yellow(msg));
  },

  error: (msg) => {
    console.log(clc.red.bold(msg));
  },

  success: (msg) => {
    console.log(clc.green.bold(msg));
  },
}

// Terminal spinner
const spinner = {
  loader: null,
  start: (msg, cb) => {

    const init = async () => {
      if (!this.loader) {
        this.loader = new Spinner(msg);
        this.loader.start();
      } else {
        this.loader.message(msg);
      }
    }

    init().then(() => {
      setTimeout(cb, 200);
    });
  },
  stop: () => {
    if (this.loader) {
      this.loader.stop();
      this.loader = null;
    }
  },
}

// Connect to ssh
const sshConnect = (env) => {

  const { SSH_HOST, SSH_PORT, SSH_PATH, SSH_USERNAME, SSH_KEYNAME, SSH_PASS } = getEnv(env);

  const sshCfg = (env) => {

    // Get ssh key
    const getSSHKey = (keyName) => {

      let isFile;
      let filePath = path.resolve(process.env.USERPROFILE, '.ssh', SSH_KEYNAME);

      try {
        isFile = fs.readFileSync(filePath);
      } catch (error) {
        log.error(error);
        isFile = '';
      }
      return (isFile) ? filePath : '';
    }

    // Get config
    const sshConfig = {
      host: SSH_HOST,
      username: SSH_USERNAME,
    }

    if (SSH_KEYNAME) {
      sshConfig.privateKey = getSSHKey(SSH_KEYNAME);
    }

    if (SSH_PASS) {
      sshConfig.password = SSH_PASS;
    }

    if (SSH_PORT) {
      sshConfig.port = SSH_PORT;
    }

    return sshConfig;
  }

  return ssh.connect(sshCfg(env)).catch(error => {
    log.error(error.toString());
    ssh.dispose();
    process.exit();
  });
}

// Run locsl shell command
const runLocal = (runner, ignore = false) => {

  spinner.start(runner.spinner, () => {
    cp.exec(runner.cmd, (error, stdout, stderr) => {

      if (!ignore && error && error.code !== 0) {
        spinner.stop();
        log.error(stderr);
        process.exit();
      }

      log.success('Done!');
      spinner.stop();
      runner.callback(error);
    });
  });
}

// Run remote shell command
const runRemote = (runner, close = false) => {

  spinner.start(runner.spinner, () => {
    ssh.execCommand(runner.cmd, { cwd: runner.cwd })
      .then(({ code, stderr }) => {

        if (!close && code !== 0) {
          spinner.stop();
          log.error(stderr);
          ssh.dispose();
          process.exit(code);
        }

        if(close) {
          ssh.dispose();
        }

        log.success('Done!');
        spinner.stop();
        runner.callback(code);
      });
  });
}

// Upload file
const uploadFile = (runner) => {

  spinner.start(`Uploading ${runner.from} to ${runner.to}...`, () => {
    ssh.putFile(runner.from, runner.to).then(() => {
      log.success('Done!');
      spinner.stop();
      runner.callback();
    }, error => {
      spinner.stop();
      log.error(error);
      ssh.dispose();
      process.exit();
    });
  });

}

// Get remote file
const getFile = (runner) => {

  spinner.start(`Downloading ${runner.from} to ${runner.to}...`, () => {

    ssh.getFile(runner.to, runner.from).then(() => {
      log.success('Done!');
      spinner.stop();
      runner.callback();
    }, error => {
      spinner.stop();
      log.error(error);
      ssh.dispose();
      process.exit();
    });

  });
}

// Upload folder
const uploadDir = (runner) => {

  const failed = [];

  spinner.start(`Uploading ${runner.src} to ${runner.dest}...`, () => {
    ssh.putDirectory(runner.src, runner.dest, {
      recursive: true,
      concurrency: 10,
      tick: function (localPath, remotePath, error) {
        error && failed.push(localPath);
      }
    }).then(status => {

      if (!status) {
        spinner.stop();
        log.error('Error! Failed transfers: ', failed.join(', \n'));
        ssh.dispose();
        process.exit();
      }
      log.success(`Done!`);
      spinner.stop();
      runner.callback();
    })
  });
}

// Remove local files & folders
const removeLocal = (path, cb) => {
  spinner.start(`Removing ${path}...`, () => {

    (async () => {
      const deletedPaths = await del(path);

      if (deletedPaths.join() !== '') {
        log.success('Done!');
      } else {
        log.simple('Nothing to delete');
      }

      spinner.stop();

      if (cb && typeof (cb) === 'function') {
        cb();
      }
    })();

  });
}

// Create local folder
const createLocalDir = (dir, cb) => {

  const callback = () => {
    spinner.stop();
    (cb && typeof (cb) === 'function') && cb();
  }

  spinner.start(`Creating ${dir} folder...`, () => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      log.success(`Done!`);
      callback();
    } else {
      callback();
    }
  });
};

// Prompt
const prompt = ({ message, callback }) => {
  (async () => {

    const response = await prompts({
      type: 'confirm',
      name: 'value',
      initial: true,
      message
    });

    if (response.value === true) {
      callback();
    } else {
      process.exit();
    }

  })();
}

// Create date/timestamp for archive/dump
const getTimeStamp = () => {
  let D = new Date(Date.now());
  let timestamp = D.getFullYear() + "" + D.getMonth() + 1 + "" + D.getDate();

  return timestamp;
}

module.exports = { onError, ssh, log, spinner, runLocal, runRemote, uploadFile, uploadDir, getFile, sshConnect, removeLocal, createLocalDir, prompt, getEnv, getTimeStamp };