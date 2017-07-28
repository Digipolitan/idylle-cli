#!/usr/bin/env node

global.Promise = require('bluebird');
const program = require('commander');

require('./commands/new')(program);
require('./commands/start')(program);
require('./commands/add')(program);

program.parse(process.argv);