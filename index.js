#!/usr/bin/env node

global.Promise = require('bluebird');
const program = require('commander');

require('./commands/new')(program);
require('./commands/start')(program);

program.parse(process.argv);