const cfg = require('../config');
const { src, dest, task } = require('gulp');
const gp = require('gulp-load-plugins')();
const { log, spinner, runLocal, runRemote, uploadFile, getFile, sshConnect, removeLocal, createLocalDir, prompt, getEnv, getTimeStamp } = require('../utils');

let allreadyPrompted = false;

// Check password
const askPass = (env, pass) => (env === 'loc') ? '' : ` -p"${pass}"`;

/** Check db
 *
 * @param {string} env 'loc/test/prod'
 * @param {function} cb 'callback function'
 */
function checkDB(env, cb) {

    const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, SSH_SUDO, SSH_PATH } = getEnv(env);
    const sudo = (SSH_SUDO) ? 'sudo ' : '';
    const query = `${sudo}mysql -u${DB_USER} -h${DB_HOST}${askPass(env, DB_PASSWORD)} -e "use ${DB_NAME}"`;

    function checkLocal() {
        runLocal({
            cmd: query,
            spinner: `Checking database "${DB_NAME}" at "${DB_HOST}"...`,
            callback(error) {
                cb(!error);
            }
        }, true);
    }

    function checkRemote() {
        sshConnect(env).then(() => {
            runRemote({
                cmd: query,
                cwd: SSH_PATH,
                spinner: `Checking database "${DB_NAME}" at "${DB_HOST}"...`,
                callback(code) {
                    cb(code !== 1);
                }
            }, true);
        });

    }

    (env === 'loc') ? checkLocal() : checkRemote();
}

/** Create db
 *
 * @param {string} env 'loc/test/prod'
 * @param {boolean} temp 'remove temp dump after task complete'
 * @param {function} cb 'callback function'
 */
function createDB(env, temp = false, cb) {

    let { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, SSH_SUDO, SSH_USERNAME, SSH_HOST, SSH_PATH } = getEnv(env);

    let dump = (temp) ? 'dump-migrate.sql' : 'dump.sql';
    let sudo = (SSH_SUDO) ? 'sudo ' : '';

    let cmd = `${sudo}mysql -u${DB_USER} -h${DB_HOST}${askPass(env, DB_PASSWORD)} -e"`;
    cmd += `DROP DATABASE IF EXISTS ${DB_NAME};`;
    cmd += `CREATE DATABASE IF NOT EXISTS ${DB_NAME} CHARACTER SET ${cfg.dbCharSet} COLLATE ${cfg.dbCollate};`;
    cmd += `"`;

    function createLocal() {
        runLocal({
            cmd,
            spinner: `Creating database "${DB_NAME}" at "${DB_HOST}" (${env})...`,
            callback() {
                updateDB(env, temp, cb);
            }
        });
    }

    function createRemote() {

        sshConnect(env).then(uploadDump);

        function uploadDump() {

            uploadFile({
                from: dump,
                to: `${SSH_PATH}/${dump}`,
                callback() {
                    createRemoteDb();
                }
            });
        }

        function createRemoteDb() {

            runRemote({
                cmd,
                cwd: SSH_PATH,
                spinner: `Creating database "${DB_NAME}" at "${DB_HOST}" (${env})...`,
                callback() {
                    updateDB(env, true, cb);
                }
            });
        }
    }

    const runCreate = () => {
        (env === 'loc') ? createLocal() : createRemote();
    }

    if (allreadyPrompted) {
        runCreate();
    } else {
        checkDB(env, (exists) => {
            if (exists) {
                prompt({
                    message: `Database "${DB_NAME}" already exists at "${DB_HOST}" (${env}). Do you want to rewrite it?`,
                    callback() {
                        backupDB(env, false, () => {
                            runCreate();
                        }, true);
                    }
                });
            } else {
                runCreate();
            }
        });
    }
}

/** Update DB
 *
 * @param {string} env 'loc/test/prod'
 * @param {boolean} temp 'remove temp dump after task complete'
 * @param {function} cb 'callback function'
 */
function updateDB(env, temp, cb) {

    let { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, SSH_SUDO, SSH_PATH } = getEnv(env);
    let sudo = (SSH_SUDO) ? 'sudo ' : '';
    let dump = (temp) ? 'dump-migrate.sql' : 'dump.sql';

    function updateLocal() {
        runLocal({
            cmd: `mysql -u${DB_USER} -h${DB_HOST} ${DB_NAME} < ${dump}`,
            spinner: `Updating database "${DB_NAME}" at "${DB_HOST}" (${env})...`,
            callback() {
                (temp) ? removeLocal(dump, cb) : cb();
            }
        });
    }

    function updateRemote() {

        const removeDump = () => {

            runRemote({
                cwd: SSH_PATH,
                cmd: `${sudo}rm -rf ${dump}`,
                spinner: `Removing ${SSH_PATH}/${dump}...`,
                callback() {
                    // ssh.dispose();
                    if (temp) {
                        removeLocal(dump, cb)
                    } else {
                        cb();
                    }
                }
            }, true);
        }

        runRemote({
            cwd: SSH_PATH,
            cmd: `${sudo}mysql -u${DB_USER} -h${DB_HOST}${askPass(env, DB_PASSWORD)} ${DB_NAME} < ${SSH_PATH}/${dump}`,
            spinner: `Updating database "${DB_NAME}" at "${DB_HOST}" (${env})...`,
            callback: removeDump
        });

    }

    (env === 'loc') ? updateLocal() : updateRemote();

}

/** Backup DB
 *
 * @param {string} env 'loc/test/prod'
 * @param {boolean} temp 'remove temp dump after task complete'
 * @param {function} cb 'callback function'
 * @param {boolean} save 'save dump to backup folder with timestamp | root folder'
 * @param {string | null} fileName 'custom dump file name'
 */
function backupDB(env, temp = false, cb, save = false, fileName = null) {

    const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, SSH_SUDO, SSH_PATH } = getEnv(env);

    const timestamp = getTimeStamp();

    let srcDump = (temp) ? 'dump-migrate.sql' : 'dump.sql';
    srcDump = (fileName) ? fileName : srcDump;

    const targetDump = (save) ? `${cfg.path.backup}/dump-${env}-${timestamp}.sql` : srcDump;
    const targetDumpPath = (env === 'loc') ? targetDump : `${SSH_PATH}/${srcDump}`;
    const sudo = (SSH_SUDO) ? 'sudo ' : '';
    const cmd = `${sudo}mysqldump --disable-keys --no-tablespaces --hex-blob -u${DB_USER}${askPass(env, DB_PASSWORD)} -h${DB_HOST} ${DB_NAME} > ${targetDumpPath}`;

    const targetDir = (env == 'loc' && save) ? cfg.path.backup : 'root';
    const spinner = `Saving dump of "${DB_NAME}" at "${DB_HOST}" (${env}) to ${targetDir} folder...`;

    function backupLocal() {
        runLocal({
            cmd,
            spinner,
            callback() {
                cb();
            }
        });
    }

    function backupRemote() {

        sshConnect(env).then(createDump);

        function createDump() {

            runRemote({
                cwd: SSH_PATH,
                cmd,
                spinner,
                callback: getRemoteDump
            });
        }

        function getRemoteDump() {
            getFile({
                from: targetDumpPath,
                to: targetDump,
                callback: removeRemoteDump
            });
        }

        function removeRemoteDump() {

            runRemote({
                cwd: SSH_PATH,
                cmd: `${sudo}rm -rf ${srcDump}`,
                spinner: `Removing ${targetDumpPath}...`,
                callback: cb
            }, true);
        }
    }

    const runBackup = () => {
        (env === 'loc') ? backupLocal() : backupRemote();
    }

    if (save) {
        createLocalDir(cfg.path.backup, runBackup);
    } else {
        runBackup();
    }
}

/** Update urls in dump file for DB migration
 *
 * @param {string} from 'loc/test/prod'
 * @param {string} to 'loc/test/prod'
 * @param {function} cb 'callback function'
 * @param {boolean} saveToFile 'only save to file with new urls'
 * @param {string | null} fileName 'custom dump file name'
 */
function updateUrls(from, to, cb, saveToFile = false, fileName = null) {

    let oldUrl = cfg.url[from];
    let newUrl = cfg.url[to];

    // Update serialized ACF links
    let diff = (oldUrl.length - newUrl.length);
    let acfLink = new RegExp(`s:\[1-9][0-9]{0,2\}:\\\\"${oldUrl}`, 'g');

    let dumpName = (fileName) ? fileName : 'dump-migrate.sql';

    spinner.start(`Changing url's from "${oldUrl}" to "${newUrl}"...`, () => {

        return src(dumpName)
            .pipe(gp.plumber(cfg.errorHandler))
            .pipe(gp.replace(acfLink, function handleReplace(match) {

                let sNum = match.match(/(\d+)/);
                let oldNum = parseInt(sNum[0]);
                let newNum = oldNum - diff;

                return `s:${newNum}:\\"${newUrl}`;
            }))
            .pipe(gp.replace(oldUrl, newUrl))
            .pipe(dest(file => file.base))
            .on('finish', () => {
                log.success('Done!');
                spinner.stop();
                if (saveToFile) {
                    cb();
                } else {
                    createDB(to, true, cb);
                }
            });
    });
}

/** Migrate db between env`s (with urls update)
 *
 * @param {string} from 'loc/test/prod'
 * @param {string} to 'loc/test/prod'
 * @param {function} cb 'callback function'
 */
function migrateDB(from, to, cb) {

    const { DB_NAME, SSH_USERNAME, SSH_HOST } = getEnv(to);
    const dbHost = (to === 'loc') ? 'localhost' : `${SSH_USERNAME}@${SSH_HOST}`;

    checkDB(to, (exists) => {

        if (exists) {
            prompt({
                message: `Database "${DB_NAME}" already exists at ${dbHost}. Do you want to rewrite it?`,
                callback() {
                    allreadyPrompted = true;

                    // Backup target first then create dump for migration
                    backupDB(to, false, () => {
                        backupDB(from, true, () => {
                            updateUrls(from, to, cb)
                        });
                    }, true);
                }
            });
        } else {
            log.error(`Database "${DB_NAME}" does not exist at ${dbHost}`);
            cb();
        }
    });
}

/** Export db to dump, converting urls
 *
 * @param {string} from 'loc/test/prod'
 * @param {string} to 'loc/test/prod'
 * @param {function} cb 'callback function'
 */
function exportDB(from, to, cb) {

    let fileName = `dump-migrate-${to}.sql`;

    backupDB(from, true, () => {
        updateUrls(from, to, cb, true, fileName);
    }, false, fileName);
}

module.exports = () => {

    // Local DB operations
    task('db:create', cb => createDB('loc', false, cb)); // Create
    task('db:backup', cb => backupDB('loc', false, cb)); // Save dump
    task('db:backup-loc', cb => backupDB('loc', false, cb, true)); // Backup local db
    task('db:from-test', cb => migrateDB('test', 'loc', cb)); // Migrate from test
    task('db:from-prod', cb => migrateDB('prod', 'loc', cb)); // Migrate from prod

    // Test DB operations
    task('db:to-test', cb => migrateDB('loc', 'test', cb)); // Migrate from loc
    task('db:export-test', cb => exportDB('loc', 'test', cb)); // Export to dump
    task('db:backup-test', cb => backupDB('test', true, cb, true)); // Backup test db

    // Prod DB operations
    task('db:to-prod', cb => migrateDB('loc', 'prod', cb)); // Migrate from loc
    task('db:export-prod', cb => exportDB('loc', 'prod', cb)); // Export to dump
    task('db:backup-prod', cb => backupDB('prod', true, cb, true)); // Backup prod db

}