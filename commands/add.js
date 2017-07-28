const fs = require('fs-extra');
const Promise = require('bluebird');
const _ = require('lodash');
const pluralize = require('pluralize');
const path = require('path');

module.exports = (p) => {
    program = p;

    const MODELS_DIRECTORY = './models';
    const ACTIONS_DIRECTORY = './actions';
    const ROUTES_DIRECTORY = './routes';

    program
        .command('add <resource>')
        .description('add a new resource to your project')
        .action((resource, options) => {
            add(resource, options);
        })
        .on('--help', () => {
            console.log('  Examples:');
            console.log();
            console.log('    $ idylle add resource');
            console.log();
        });


    function add(resource) {
        return ensureDirectoriesExist()
            .then(createModel)
            .then(createActions)
            .then(createRoute);


        function ensureDirectoriesExist() {
            return Promise.each([
                MODELS_DIRECTORY,
                ACTIONS_DIRECTORY,
                ROUTES_DIRECTORY
            ], ensure);

            function ensure(path) {
                return new Promise((resolve, reject) => {
                    fs.stat(path, (err, stats) => (err) ? reject(err) : resolve(stats));
                })
            }
        }

        function createModel() {
            const modelPath = path.join(MODELS_DIRECTORY, `${_.capitalize(resource)}.js`);

            return fs.writeFile(modelPath, 'module.exports = {};')
        }

        function createActions() {
            const actionDirectoryPath = path.join(ACTIONS_DIRECTORY, `${_.lowerCase(pluralize(resource))}`);
            return fs.mkdir(actionDirectoryPath)
                .then(addCRUD);


            function addCRUD() {
                const CRUDFiles = [
                    'show.js',
                    'search.js',
                    'list.js',
                    'count.js',
                    'create.js',
                    'update.js',
                    'remove.js'
                ];

                return Promise.each(CRUDFiles, create);

                function create(file) {
                    const model = _.capitalize(resource);

                    return new Promise((resolve, reject) => {
                        const filePath = path.join(actionDirectoryPath, file);
                        fs.writeFile(filePath, 'module.exports = app => {\n' +
                            `    const ${model} = app.models.${model};\n` +
                            '    \n' +
                            '    return Action({\n' +
                            '        execute: context => {\n' +
                            '\n' +
                            '        }\n' +
                            '    });\n' +
                            '};\n', (err, data) => (err) ? reject(err) : resolve(data))
                    });
                }
            }
        }

        function createRoute() {
            const pluralizedResource = pluralize(resource);
            const routePath = path.join(ROUTES_DIRECTORY, `${_.lowerCase(pluralizedResource)}.js`);

            return fs.writeFile(routePath, 'module.exports = app => {\n' +
                '    const router = app.server.Router();\n' +
                '\n' +
                '    router\n' +
                '\n' +
                '        .get(\'/\',\n' +
                `            app.actions.${pluralizedResource}.list.expose()\n` +
                '        )\n' +
                '\n' +
                '        .get(\'/:id\',\n' +
                `            app.actions.${pluralizedResource}.show.expose()\n` +
                '        )\n' +
                '\n' +
                '        .get(\'/search\',\n' +
                `            app.actions.${pluralizedResource}.search.expose()\n` +
                '        )\n' +
                '\n' +
                '        .get(\'/count\',\n' +
                `            app.actions.${pluralizedResource}.count.expose()\n` +
                '        )\n' +
                '\n' +
                '        .post(\'/\',\n' +
                '            app.middlewares.bodyParser.json(),\n' +
                `            app.actions.${pluralizedResource}.create.expose()\n` +
                '        )\n' +
                '\n' +
                '        .put(\'/\',\n' +
                `            app.actions.${pluralizedResource}.update.expose()\n` +
                '        )\n' +
                '\n' +
                '        .delete(\'/\',\n' +
                `            app.actions.${pluralizedResource}.remove.expose()\n` +
                '        );\n' +
                '\n' +
                `    app.server.use('/${pluralizedResource}', router);\n` +
                '};')
        }
    }
};

