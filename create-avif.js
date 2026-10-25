const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
}

// Small valid AVIF base64 data
const avifBase64 = "AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAAFsZXRld3AAAAA2bWV0YQAAAAAAAAAhaGRscgAAAAAAAAAacGljdAAAAAAAAAAAAAAAAGxpYnJhAAABCWlsc3QAAAAAAAAADGl0aW4AAAAAAAAAA2lpcmYAAAAAAAEgYXZpMQAAAABsaXN0AAAAAAAAABFpbmZvAAAAAAABACAAAAAabWlyZgAAAAAAAAAMaXBycAAAAAAAAAAYaXBjbwAAAAAAAABpc3BlAAAAAAAAAAAAAAASaXJvZAAAAAAAAAAAYXZpQwEBEQAAAABsaXN0AAAAAAAAABFpbmZvAAAAAAABACAAAAAabWlyZgAAAAAAAAAMaXBycAAAAAAAAAA=";

fs.writeFileSync(path.join(imgDir, 'logo.avif'), Buffer.from(avifBase64, 'base64'));
console.log('[create-avif] Successfully created public/images/logo.avif');
