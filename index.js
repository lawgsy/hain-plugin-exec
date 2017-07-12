'use strict'

const { spawn } = require('child_process');
const fs    = require('fs');
const path  = require('path');

/**
 * Replace all occurences in given text.
 * @param  {string} text    Original text
 * @param  {string} search  Text to be replaced
 * @param  {string} replace Replacement text
 * @return {string}         Resulting text
 */
function replaceAll(text, search, replace) {
  return text.split(search).join(replace);
}

module.exports = (pluginContext) => {
  const logger   = pluginContext.logger;
  const toast    = pluginContext.toast;
  const app      = pluginContext.app;
  const template = fs.readFileSync(path.join(__dirname, 'output.html'), 'utf8');
  const DEBUG    = false;
  let timer      = null;
  let prev_cmd   = "";
  let output     = "";
  let html       = "";

  function startup() {
    html = replaceAll(template,'%output%', "Output goes here, if any...");
  }

  function search (query, res) {
    const query_trim = query.trim();

    // no input
    if(query_trim.length === 0) return;

    // new input (and not a forced refresh)
    if(query_trim != prev_cmd && query_trim != prev_cmd+'.')
      html = replaceAll(template,'%output%', "Output goes here, if any...");

    res.add({
      id:      query_trim,
      payload: null,
      title:   query_trim,
      desc:    `Execute <b>${query_trim}</b>`,
      preview: true
    });

  }

  function debug() {
    if (DEBUG) logger.log('DEBUG::', arguments);
  }

  function execute(id, payload) {
    prev_cmd = id;

    let args  = id.split(' ');
    let cmd   = args.shift();
    let child = spawn(cmd, args);
    output    = "";

    timer = setTimeout(() => {
      child.kill();
      toast.enqueue(`'${cmd}' timed out (and was killed)`);
      output += "(execution interrupted - 5 second timeout reached)";

      forceRefresh(id);
    }, 5000); // 5 second time-out by default

    toast.enqueue(`Spawned ${cmd} with arguments ['`+args.join('\', \'')+`']`);

    child.stdout.on('data', data => { // stdout received
      output += data;
      forceRefresh(id);
    });
    child.stderr.on('data', data => { // stderr received
      output += `<span style="color:#FF0000">${data}</span>`;
      forceRefresh(id);
    });

    child.on('close', code => { // execution finished or was interrupted
      clearTimeout(timer);

      output += `child process exited with code ${code}`;
      forceRefresh(id);
    });
  }

  function forceRefresh(id) {
    html = replaceAll(template,'%output%', output);

    // hack to force preview refresh by setting a different query, then
    // setting it back to the user input
    app.setQuery(`/exec ${id}.`);
    setTimeout(() => {
      app.setQuery(`/exec ${id}`);
    }, 200); // timeout might have to be larger to work in all situations
  }

  function renderPreview(id, payload, render) {
    render(html);
  }

  return { startup, search, execute, renderPreview }
}
