const fs = require('fs');
let code = fs.readFileSync('src/defaultData.ts', 'utf8');

// The regex will look for `processes: [ ... ]` and convert strings inside to `{ text: ..., images: [] }`
// Actually, it's easier to just match `processes: [` to `],` and replace it using eval or careful regex.
// Wait, regex might be hard. Let's just do a regex replace on the specific strings inside processes arrays.
// Because the strings are quoted like `'...'`.

// We know each `processes: [` block is followed by strings. 
const updatedCode = code.replace(/processes:\s*\[([\s\S]*?)\]/g, (match, p1) => {
  // p1 contains the items, e.g. `\n      'some string',\n      'another string'\n    `
  // let's match the string literals inside it
  let newItems = p1.replace(/'([^']*)'/g, "{ text: '$1', images: [] }");
  return `processes: [${newItems}]`;
});

fs.writeFileSync('src/defaultData.ts', updatedCode);
