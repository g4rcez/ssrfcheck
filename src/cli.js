#!/usr/bin/env node

const { isSSRFSafeURL } = require('../src/index.js');

(function() {
  const args = process.argv.slice(2);
  const url = args.filter(item => !item.startsWith('--'))[0];
  const autoProtocol = args.find(item => item.startsWith('--auto-prepend-protocol='))?.split('=')[1];

  const config = {
    noIP: args.includes('--no-ip'),
    quiet: args.includes('--quiet'),
    allowUsername: args.includes('--allow-username'),
    allowedProtocols: args.find(item => item.startsWith('--allowed-protocols='))?.split('=')[1].split(',') || ['http', 'https'],
    autoPrependProtocol:  autoProtocol ? (autoProtocol === 'false' ? false : autoProtocol) : 'https', 
  };

  const isSafe = isSSRFSafeURL(url, config);
  console.log(isSafe ? 'Safe' : 'Danger!');
  return isSafe;
})();
