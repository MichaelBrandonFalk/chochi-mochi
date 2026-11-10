const path = require('node:path');
const ORIGIN = 'chochi://game';
function isGameURL(value) { try { const u = new URL(value); return u.protocol === 'chochi:' && u.hostname === 'game' && !u.port && !u.username && !u.password; } catch { return false; } }
function assetPath(root, value) {
  if (!isGameURL(value)) throw new Error('Unknown game address');
  const pathname = decodeURIComponent(new URL(value).pathname);
  if (pathname.includes('\0') || pathname.includes('\\')) throw new Error('Invalid path');
  const target = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  const relative = path.relative(root, target);
  if (relative === '..' || relative.startsWith('..' + path.sep) || path.isAbsolute(relative)) throw new Error('Path outside game');
  return target;
}
const externalHosts = new Set(['www.spacetreatment.net', 'spacetreatment.net', 'iocdf.org', 'pmc.ncbi.nlm.nih.gov', 'michaelbrandonfalk.github.io', 'github.com']);
function isExternalLink(value) { try { const u = new URL(value); return u.protocol === 'https:' && !u.username && !u.password && !u.port && externalHosts.has(u.hostname); } catch { return false; } }
function saveLocation({ platform, executable, portableDirectory, appImage, userData, packaged, macPortableDirectory }) {
  const p = platform === 'win32' ? path.win32 : path.posix;
  if (!packaged) return { directory: p.join(userData, 'Development saves'), portable: false };
  if (platform === 'win32' && portableDirectory) return { directory: p.join(portableDirectory, 'Chochi Mochi Data'), portable: true };
  if (platform === 'linux' && appImage) return { directory: p.join(p.dirname(appImage), 'Chochi Mochi Data'), portable: true };
  if (platform === 'linux' && !/^\/(opt|usr)\//.test(executable)) return { directory: p.join(p.dirname(executable), 'Chochi Mochi Data'), portable: true };
  if (platform === 'darwin' && macPortableDirectory) return { directory: macPortableDirectory, portable: true };
  return { directory: p.join(userData, 'Saved game'), portable: false };
}
function diskImageSource(info, mountPoint) {
  const image = info?.images?.find(item => item['system-entities']?.some(entity => entity['mount-point'] === mountPoint));
  const source = image?.['image-path'];
  return typeof source === 'string' && path.posix.isAbsolute(source) ? path.posix.dirname(source) : null;
}
const CSP = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' blob:; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-src 'none'";
module.exports = { ORIGIN, CSP, isGameURL, assetPath, isExternalLink, saveLocation, diskImageSource };
