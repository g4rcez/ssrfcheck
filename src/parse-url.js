const { isIP } = require('net');
const { trimBrackets } = require('./trim-brackets');

/**
  when try to create a URL from the arg we take advantage of runtime 
  native checkings. the normalize NFKD will clear the charset, which 
  will allow us to deal with exotic-chars as http://ⓔⓧⓐⓜⓟⓛⓔ.ⓒⓞⓜ
  which results in http://example.com.
*/
function normalizeURLStr(str) {
  if (typeof str !== 'string') {
    return '';
  };

  return str
    .trim()                                 // removed start and end spaces
    .normalize('NFKD')                      // removed accents and diacrictics, normalize fancy chars
    .split(' ')                             // breaks it onto parts dividing by spaces to check trailing \
    .map(item => item.replace(/\\+$/, ""))  // remove all trailing backslaches, e.g: x\ to x
    .join(' ');                             // reassembling it
}

function startsWithProtocol(input) {
  const match = (input || '')
    .trim()
    .toLowerCase()
    .match(/(?:[a-z,0-9]+?):\/\//);

  return !!(match && match.index === 0);
}

function parseURL(input, autoPrependProtocol) {
  const RESULT_INVALID_URL = { validSchema: false };

  try {
    const url = new URL(normalizeURLStr(input));
    const ipcheck = trimBrackets(url.hostname);
    const ipVersion = isIP(ipcheck);
    const hostIsIp = !!ipVersion;

    return Object.assign(url, {
      ip: hostIsIp ? ipcheck : null,
      validSchema: true,
      ipVersion,
      hostIsIp,
    });
  } catch {
    if (!startsWithProtocol(input) && autoPrependProtocol) {
      return parseURL(`${autoPrependProtocol}://${input}`, false);
    }

    return RESULT_INVALID_URL;
  }
}

module.exports = {
  parseURL
}
