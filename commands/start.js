const spawn = require('child_process').spawn;
const chalk = require('chalk');

module.exports = (program) => {
    program
        .command('start')
        .description('start your project from npm start script')
        .action(() => {
            const stream = spawn('npm', ['start']);
            stream.stderr.on('data', data => console.error(chalk.red(data.toString())));
            stream.stdout.on('data', data => console.log(data.toString()));
        })
}