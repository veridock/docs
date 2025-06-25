// generate-svg-preview.js
const fs = require("fs");
const { JSDOM } = require("jsdom");

function createSvgPreview(rootElement, width = 300) {
  const elemHeight = 30;
  const padding = 5;
  let y = padding;

  function getStyle(el, prop) {
    // W Node bez prawdziwego stylu zwracamy defaulty lub inline style
    let val = el.style[prop];
    if (!val) val = "transparent";
    return val;
  }

  let svgElems = [];

  function walk(el) {
    if (el.nodeType !== 1) return;

    const bg = getStyle(el, "backgroundColor");
    const borderColor = getStyle(el, "borderColor");
    const borderWidth = parseInt(getStyle(el, "borderWidth")) || 0;

    svgElems.push(
      `<rect x="${padding}" y="${y}" width="${width - 2 * padding}" height="${elemHeight}" fill="${bg}" stroke="${borderColor}" stroke-width="${borderWidth}"/>`
    );

    y += elemHeight + padding;

    for (let child of el.children) {
      walk(child);
    }
  }

  walk(rootElement);

  const svgContent = svgElems.join("\n");

  return `
<svg width="${width}" height="${y}" xmlns="http://www.w3.org/2000/svg">
  ${svgContent}
</svg>
  `.trim();
}

// --- Główna część ---
const filePath = process.argv[2];
if (!filePath) {
  console.error("Usage: node generate-svg-preview.js path/to/file.html");
  process.exit(1);
}

const html = fs.readFileSync(filePath, "utf8");
const dom = new JSDOM(html);
const rootEl = dom.window.document.body.firstElementChild;

const svg = createSvgPreview(rootEl);

console.log(svg);
