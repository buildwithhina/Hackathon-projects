"use client";

import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";

export function Pass({ token, name, checkedIn }: { token: string; name: string; checkedIn: boolean }) {
  const svg = useRef<SVGSVGElement>(null);
  const value = `eventhub:${token}`;

  function download() {
    if (!svg.current) return;
    const file = new Blob([new XMLSerializer().serializeToString(svg.current)], { type: "image/svg+xml" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = `eventhub-pass-${token.slice(0, 8)}.svg`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <article className="eh-pass">
      <QRCodeSVG ref={svg} value={value} size={170} marginSize={4} title={`QR pass for ${name}`} />
      <div><h3>{name}</h3><p>{checkedIn ? "Checked in" : "Ready for check-in"}</p></div>
      <button className="eh-button secondary" type="button" onClick={download}>Download QR</button>
      <details><summary>Manual check-in code</summary><code>{value}</code></details>
    </article>
  );
}
