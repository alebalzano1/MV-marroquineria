const fs = require('fs');

// We don't really need jsdom if we just create a mock environment for React and HTM.
// But let's just do a simple eval that catches ReferenceError or SyntaxError.
// We'll mock React, ReactDOM, and htm.
const htmlText = fs.readFileSync('index.html', 'utf8');
const scriptMatch = htmlText.match(/<script\b[^>]*>([\s\S]*?)<\/script>/i);
if (!scriptMatch) {
  console.error('Could not find script block inside index.html!');
  process.exit(1);
}
const scriptText = scriptMatch[1];

const mockEnv = `
  const React = {
    useState: (val) => [val, () => {}],
    useEffect: () => {},
    useRef: () => ({ current: null }),
    createElement: () => {}
  };
  const ReactDOM = { createRoot: () => ({ render: () => {} }) };
  const htm = { bind: () => () => 'htm_mock' };
  const document = {
    getElementById: () => ({}),
    createElement: () => ({}),
    head: { appendChild: () => {} }
  };
  const window = {};
  const localStorage = { getItem: () => null, setItem: () => {} };
  const crypto = { subtle: { digest: () => {} } };
` + "\n" + scriptText;

try {
  eval(mockEnv);
  console.log('Script executed successfully in mock environment');
} catch (e) {
  console.error('Error in script:', e.toString(), e.stack);
  process.exit(1);
}
