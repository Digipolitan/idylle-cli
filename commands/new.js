// Dependencies
const chalk = require('chalk');
const path = require('path');
const fs = require('fs-extra');
const https = require('https');
const decompress = require('decompress');
const _ = require('lodash');
// External resources
const ArchetypesRepositories = require('./ArchetypesRepositories');

// Script variables
const zipPath = '/tmp/archetype.zip';
let project = null;
let projectPath = null;
let archetype = null;
let error = null;
let program = null;

/**
 1. Errors
 ****************************/
class DirectoryNotFoundError extends Error {
}

class DirectoryNotEmptyError extends Error {
}

/**
 2. Arguments parsing
 ****************************/
module.exports = (p) => {
    program = p;

    program
        .command('new <project_name>')
        .description('create a new project')
        .option("-a, --archetype <archetype>", "define a custom archetype")
        .action((project, options) => {
            create(project, options);
        })
        .on('--help', () => {
            console.log('  Examples:');
            console.log();
            console.log('    $ idylle new my_project');
            console.log();
        });
}


/**
 3. Abstract Core logic
 ****************************/

function create(p, options) {
    project = path.join('.', p);

    return ensureDirectoryExists()
        .catch(DirectoryNotFoundError, createDirectory)
        .then(ensureDirectoryEmpty)
        .then(downloadArchetype)
        .then(unzip)
        .then(clean)
        .then(() => console.log('done.'))
        .catch(print)
}

/**
 4. Implementation
 ****************************/

function ensureDirectoryExists() {
    projectPath = path.join('.', project);

    return fs.access(projectPath)
        .catch(err => {
            throw new DirectoryNotFoundError(err);
        });
}

function createDirectory() {
    return fs.mkdir(projectPath)
}

function ensureDirectoryEmpty() {
    return fs.readdir(projectPath)
        .then(ensureNone)
        .catch(err => {
            throw new DirectoryNotEmptyError(`destination path ${project} already exists and is not an empty directory.`);
        })
}

function downloadArchetype() {
    return new Promise((resolve, reject) => {
        let file = fs.createWriteStream(zipPath, {encoding: 'binary'});
        https.get(ArchetypesRepositories.default, response => {
            response.pipe(file);
            file.on('finish', function () {
                file.close(() => resolve());  // close() is async, call cb after close completes.
            });
        }).on('error', err => {
            fs.unlink(zipPath); // Delete the file async. (But we don't check the result)
            reject(err)
        });
    });
}

function unzip() {
    let rootDir = null;
    return decompress(zipPath, projectPath, {
        map: file => {
            if (isRoot(file.path)) {
                rootDir = file.path;
                file.path = '../' + file.path;
                return file;
            }

            file.path = removeRoot(file.path);
            return file;
        }
    })
        .then(() => rootDir);
}

function clean(rootDir) {
    fs.rmdir(rootDir);
    return removeGitKeep(projectPath);

    function removeGitKeep(dirPath) {
        return fs.readdirSync(dirPath)
            .forEach(file => fs.statSync(path.join(dirPath, file)).isDirectory()
                ? removeGitKeep(path.join(dirPath, file))
                : file.indexOf('.gitkeep') !== -1
                    ? fs.unlink(path.join(dirPath, file))
                    : _.noop());
    }
}

function print(reason) {
    console.log(chalk.red(reason))
}

/**
 5. Utils
 ****************************/

function ensureNone(data) {
    return (data === undefined || data === null || data === 0 || data.length === 0) ? Promise.resolve() : Promise.reject();
}


function isRoot(filePath) {
    let paths = filePath.split('/');
    return paths[1] === '';
}

function removeRoot(filePath) {
    let paths = filePath.split('/');
    delete paths[0];
    return paths.join('/');
}