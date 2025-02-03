const cfg = require('../config');
const gulp = require('gulp');
const gp = require('gulp-load-plugins')();
const fs = require('fs-extra');
const open = require('open');
const { onError, log, spinner, runLocal, removeLocal, createLocalDir } = require('../utils');

// Create & configure app
const createApp = (cb) => {

  // Check required fields in config
  const checkConfig = (cb) => {

    let errors = [];

    const required = {
      siteName: cfg.siteName,
      themeName: cfg.themeName,
      dbName: cfg.db.loc.name
    };

    Object.keys(required).forEach(key => {
      if (required[key] === '') {
        errors.push(key);
      }
    });

    if (errors.length) {
      errors.forEach(key => {
        log.error(`Enter ${key} in config.json!`);
      });

      log.error('Please setup required data and run "yarn app-install" again.');
    } else {
      cb();
    }
  }

  // Check if app is not installed
  const checkInstall = () => {

    if (fs.existsSync('app')) {
      log.error('Already installed!');
      process.exit();
    } else {
      checkConfig(copyFolders);
    }
  }

  // Copy app folder from src
  const copyFolders = () => {
    gulp.src('src/app/**/*', {
      dot: true,
      buffer: false,
      allowEmpty: true
    })
      .pipe(gp.plumber(onError))
      .pipe(gulp.dest('app'))
      .on('finish', () => {
        setupWPconfig();
        multiFolders();
      });
  }

  // Setup src folders for desktop/mobile styles & scripts
  const multiFolders = () => {
    let folders = [
      'src/scss/desktop',
      'src/scss/mobile',
      'src/js/desktop',
      'src/js/mobile',
    ];

    if (cfg.mutltiDevice) {

      folders.forEach(f => {
        createLocalDir(f, () => {
          fs.writeFile(`${f}/.gitkeep`, '', (err) => {
            if (err) throw err;
          });
        });
      })
    }
  }

  // Setup local-config.php
  const setupWPconfig = () => {

    gulp.src('app/local-config.php')
      .pipe(gp.plumber(onError))
      .pipe(gp.replace('db.loc.name', cfg.db.loc.name))
      .pipe(gp.replace('db.loc.user', cfg.db.loc.user))
      .pipe(gp.replace('db.loc.pass', cfg.db.loc.pass))
      .pipe(gp.replace('db.loc.host', cfg.db.loc.host))
      .pipe(gp.replace('db.test.name', cfg.db.test.name))
      .pipe(gp.replace('db.test.user', cfg.db.test.user))
      .pipe(gp.replace('db.test.pass', cfg.db.test.pass))
      .pipe(gp.replace('db.test.host', cfg.db.test.host))
      .pipe(gulp.dest('app/'))
      .on('finish', () => {
        setupYeoman();
      });
  }

  // Setup Yeoman
  const setupYeoman = () => {

    const yeopress = {
      tablePrefix: cfg.db.loc.prefix,
      dbHost: cfg.db.loc.host,
      dbName: cfg.db.loc.name,
      dbUser: cfg.db.loc.user,
      dbPass: cfg.db.loc.pass,
      git: false,
      customDirs: false,
      installTheme: false,
      wpDir: ".",
      contentDir: "wp-content",
      url: cfg.url.loc
    }

    try {
      fs.writeFileSync('app/.yeopress', JSON.stringify(yeopress, null, 4));
      cb();
    } catch (error) {
      log.error(error);
      process.exit();
    }
  }

  checkInstall();

}

// Start Worpress setup in browser
const runApp = async (cb) => {
  await open(cfg.url.loc);
  cb();
}

// Removed useless themes/plugins/files/posts
const setupApp = (cb) => {

  const cleanDB = () => {
    let db = cfg.db.loc;
    let cmd = `mysql -u${db.user} -h${db.host} ${db.name} -e"`;
    cmd += `DELETE from ${db.prefix}comments;`;
    cmd += `DELETE from ${db.prefix}posts;`;
    cmd += `DELETE from ${db.prefix}postmeta;`;
    cmd += `UPDATE ${db.prefix}options SET option_value = '${cfg.themeName}' WHERE option_name = 'stylesheet' OR option_name = 'template';`;
    cmd += `UPDATE ${db.prefix}options SET option_value = '${cfg.url.loc}/' WHERE option_name = 'siteurl' OR option_name = 'home';`;
    cmd += `DELETE FROM ${db.prefix}options WHERE option_name LIKE ('%\_transient\_%');`;
    cmd += `"`;

    runLocal({
      cmd,
      spinner: 'Updating WP database. Cleaning unused files...',
      callback() {
        open(`${cfg.url.loc}/admin`);
        cb();
      }
    });

  }

  const cleanFiles = () => {
    const toRemove = [
      '.git',
      `app/.yeopress`,
      `app/readme.html`,
      `app/license.txt`,
      `app/wp-content/plugins/**`,
      `!app/wp-content/plugins`,
      `!app/wp-content/plugins/index.php`,
      `app/wp-content/themes/**`,
      `!app/wp-content/themes`,
      `!app/wp-content/themes/${cfg.themeName}`,
      'src/app'
    ];

    removeLocal(toRemove, cleanDB);
  }

  const updateHtacess = () => {

    return gulp.src(['app/.htaccess'], { dot: true })
      .pipe(gp.replace('RewriteBase /app/', 'RewriteBase /'))
      .pipe(gp.replace('RewriteRule . /app/index.php', 'RewriteRule . /index.php'))
      .pipe(gulp.dest(file => file.base))
      .on('end', () => {
        cleanFiles();
      });
  }

  spinner.start('Updating .htaccess...', updateHtacess);
}

module.exports = () => {
  gulp.task('app-create', gulp.series(createApp));
  gulp.task('app-setup', gulp.series(setupApp));
  gulp.task('app-run', gulp.series(runApp));
}