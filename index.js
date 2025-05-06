const fs = require('fs');
const path = require('path');

// Load the games JSON
const games = JSON.parse(fs.readFileSync('./cdn/games.json', 'utf8'));

// Create the wrappers directory if it doesn't exist
const wrappersDir = path.join(__dirname, 'wrappers');
if (!fs.existsSync(wrappersDir)) {
  fs.mkdirSync(wrappersDir);
}

// Helper to sanitize file names
function sanitizeFileName(name) {
  return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}

// Generate a wrapper file for each game
games.forEach(game => {
  const wrapperName = sanitizeFileName(game.title || path.basename(game.link, '.html'));
  const wrapperPath = path.join(wrappersDir, `${wrapperName}.html`);

  const relativePath = path.relative(wrappersDir, path.join(__dirname, game.link)).replace(/\\/g, '/');

  const htmlContent = `<!DOCTYPE html>
<html>
  <head>
    <title>${game.title}</title>
    <style>html, body, iframe { margin: 0; height: 100%; width: 100%; border: none; }</style>
  </head>
  <body>
    <iframe src="${relativePath}"></iframe>
  </body>
</html>`;

  fs.writeFileSync(wrapperPath, htmlContent);
  console.log(`Created wrapper: wrappers/${wrapperName}.html`);
});
