const cfg = require('../config');
const gulp = require('gulp');
const { ssh, log, runLocal, runRemote, uploadFile, uploadDir, getFile, sshConnect, createLocalDir, prompt, getEnv } = require('../utils');

const testServerPath = '/home/bambuky/bambus.com.ua/tests';

const backup = (env, cb) => {

    const { SSH_PATH, SSH_SUDO } = getEnv(env);

    let sudo = (SSH_SUDO) ? 'sudo ' : '';
    let archiveName = `${cfg.siteName}.tar.gz`;
    let archivePath = `${SSH_PATH}/${archiveName}`;

    (env === 'loc') ? backupLocal() : backupRemote();

    function backupLocal() {

        createLocalDir(cfg.path.backup, () => {
            runLocal({
                cmd: `tar -czf ${cfg.path.backup}/${archiveName} -C app *`,
                spinner: `Creating archive ${cfg.path.backup}/${archiveName}...`,
                callback: cb
            });
        });
    }

    function backupRemote() {

        const createArchive = () => {

            runRemote({
                cwd: SSH_PATH,
                cmd: `${sudo}touch ${archiveName};${sudo}tar --exclude=${archiveName} --xform s:'^./':: -czf ${archiveName} . `,
                spinner: `Creating archive ${SSH_PATH}/${archiveName}...`,
                callback: getArchive,
                fallback: removeArchive
            });
        }

        const getArchive = () => {

            createLocalDir(cfg.path.backup, () => {
                getFile({
                    to: `${cfg.path.backup}/${env}-${archiveName}`,
                    from: archivePath,
                    callback: removeArchive,
                    fallback: removeArchive
                });
            });
        }

        const removeArchive = () => {

            runRemote({
                cwd: SSH_PATH,
                cmd: `${sudo}rm -rf ${archiveName}`,
                spinner: `Removing ${SSH_PATH}/${archiveName}...`,
                callback: cb
            }, true);
        }

        sshConnect(env).then(createArchive);
    }
}

const deploy = (env, archived = false, src = null, cb) => {

    const { SSH_PATH, SSH_SUDO, SSH_USERNAME, SSH_HOST } = getEnv(env);

    let sudo = (SSH_SUDO) ? 'sudo ' : '';
    let archiveName = `${cfg.siteName}.tar.gz`;
    let archivePath = `${SSH_PATH}/${archiveName}`;
    let localSrc = (archived) ? `${cfg.path.backup}/${archiveName}` : `app/${src}`;
    let dest = SSH_PATH + ((src) ? `/${src}` : '');

    let envFileSrc = `.env.${env}`;

    const runDeploy = () => {
        sshConnect(env).then(clean);
    }

    prompt({
        message: `It will rewrite all files & folders at existing path: \n "${SSH_USERNAME}@${SSH_HOST}${dest}" \n Are you sure?`,
        callback() {
            if (archived) {
                backup('loc', runDeploy);
            } else {
                runDeploy();
            }
        }
    });

    function clean() {

        // Check correct path on test server
        if (env === 'test' && SSH_PATH === testServerPath) {
            log.error('Invalid path for stage server!!!');
            ssh.dispose();
            cb();
        }

        runRemote({
            cwd: SSH_PATH,
            cmd: `${sudo}rm -rf ${dest}`,
            spinner: `Removing ${dest}...`,
            callback: upload
        });
    }

    function upload() {

        if (archived) {
            uploadFile({
                from: localSrc,
                to: archivePath,
                callback: unpack
            });
        } else {
            uploadDir({
                src: localSrc,
                dest,
                callback: chmod
            });
        }
    }

    function unpack() {

        runRemote({
            cwd: SSH_PATH,
            cmd: `${sudo}tar -xf ${archivePath} -C ${SSH_PATH}; ${sudo}rm -rf ${archivePath}`,
            spinner: `Unpacking ${archivePath}...`,
            callback: copyEnv
        });
    }

    function copyEnv() {
        uploadFile({
            from: envFileSrc,
            to: `${SSH_PATH}/.env`,
            callback: chmod
        });
    }

    function chmod() {

        let cmd = `${sudo}find ${dest} -type f -print0 | xargs -0 chmod 644;`
        cmd += `${sudo}find ${dest} -type d -print0 | xargs -0 chmod 755;`;

        let msg = 'Updating chmod...';

        // Custom .htaccess update for "bambuky tests" subdomain
        if (env === 'test' && !src) {
            msg += "Rewriting rules in .htaccess...";
            cmd += `${sudo}sed -i 's,RewriteBase /,RewriteBase /${cfg.siteName}/,g' ${SSH_PATH}/.htaccess;`
            cmd += `${sudo}sed -i 's,RewriteRule . /index.php,RewriteRule . /${cfg.siteName}/index.php,g' ${SSH_PATH}/.htaccess`;
        }

        runRemote({
            cwd: SSH_PATH,
            cmd: cmd,
            spinner: msg,
            callback: cb
        }, true);
    }
}

module.exports = () => {

    // Backup
    gulp.task('app:backup-loc', (cb) => backup('loc', cb));
    gulp.task('app:backup-test', (cb) => backup('test', cb));
    gulp.task('app:backup-prod', (cb) => backup('prod', cb));

    // Deploy to test server
    gulp.task('theme:to-test', (cb) => deploy('test', false, cfg.path.theme, cb));
    gulp.task('app:to-test', (cb) => deploy('test', true, null, cb));

    // Deploy to prod server
    gulp.task('theme:to-prod', (cb) => deploy('prod', false, cfg.path.theme, cb));
    gulp.task('app:to-prod', (cb) => deploy('prod', true, null, cb));

}