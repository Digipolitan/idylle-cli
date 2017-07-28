global.Action = require('idylle').Action;

const Core = require('idylle').Core;
const app  = new Core();

app
    .on(Core.events.started, app => console.log(`Server listening on port ${app.settings.port}`))
    .start();

// Exposing the app allowing tests.
module.exports = app;
