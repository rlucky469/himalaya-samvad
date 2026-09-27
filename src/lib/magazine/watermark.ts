import "server-only";
import sharp from "sharp";

const escapeXml = (value: string) => value.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]!);

/** Burns a faint, repeated diagonal watermark into a page image (it can't be removed with devtools). */
export async function watermarkPage(input: Buffer, text: string): Promise<Buffer> {
  const image = sharp(input);
  const { width = 1400, height = 1980 } = await image.metadata();
  const label = escapeXml(text);
  const fontSize = Math.round(width / 42);
  const rows = Array.from({ length: 9 }, (_, i) => {
    const y = ((i + 0.5) * height) / 9;
    const x = i % 2 === 0 ? width * 0.08 : width * 0.3;
    return `<text x="${x}" y="${y}" transform="rotate(-28 ${width / 2} ${y})">${label}</text>`;
  }).join("");
  const svg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <g font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="700" fill="#1b3a6b" fill-opacity="0.075">${rows}</g>
    </svg>`,
  );
  return image.composite([{ input: svg, top: 0, left: 0 }]).webp({ quality: 82 }).toBuffer();
}
