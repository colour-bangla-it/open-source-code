const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
}

// 1x1 transparent PNG base64 fallback or small PNG data
const pngBase64 = "iVBORw0KGgoAAAANSUhEUgAAASwAAABkCAYAAADkwlGDAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAtSURBVHgB7cEBDQEAAAMg7097gwtsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAK8GLG4AAe5S8u0AAAAASUVORK5CYII=";

fs.writeFileSync(path.join(imgDir, 'logo.png'), Buffer.from(pngBase64, 'base64'));
console.log('[create-logo] Successfully created public/images/logo.png');
