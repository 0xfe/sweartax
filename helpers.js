function randomString(len) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < len; i += 1) text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

function log(...args) {
  // eslint-disable-next-line
  console.log('SwearJar:', ...args);
}

function logError(...args) {
  // eslint-disable-next-line
  console.error('SwearJar:', ...args);
}

export { randomString, log, logError };
