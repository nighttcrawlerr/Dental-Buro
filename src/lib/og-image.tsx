import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * Картинка-превью для соцсетей и мессенджеров, 1200×630.
 *
 * Та же система, что на сайте: эспрессо, крупный Cormorant, моноширинная
 * подпись и одна полоса акцента. Картинки собираются при сборке, поэтому
 * шрифты читаются с диска — из assets/fonts, в TTF: генератор не понимает
 * woff2, которые отдаёт next/font.
 */
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const fontsDir = join(process.cwd(), "assets/fonts");
const cormorant = readFile(join(fontsDir, "CormorantGaramond-Regular.ttf"));
const onest = readFile(join(fontsDir, "Onest-Regular.ttf"));

export async function renderOgImage({
  eyebrow,
  title,
  note,
}: {
  /** Строка над заголовком: раздел сайта. */
  eyebrow: string;
  title: string;
  /** Строка внизу: цена, специальность. */
  note?: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#3e342b",
          color: "#f3eee8",
          fontFamily: "Onest",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 10, height: 10, borderRadius: 999, background: "#c8d4de" }} />
          <div style={{ fontSize: 24, letterSpacing: 3, textTransform: "uppercase", color: "#c6bcb2" }}>
            {eyebrow}
          </div>
        </div>

        <div
          style={{
            fontFamily: "Cormorant",
            fontSize: title.length > 28 ? 84 : 108,
            lineHeight: 1,
            letterSpacing: -2,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid #5a5047",
            paddingTop: 28,
            fontSize: 28,
          }}
        >
          <div style={{ color: "#c6bcb2" }}>{note ?? ""}</div>
          <div style={{ letterSpacing: 6, textTransform: "uppercase", fontSize: 22 }}>
            Dental Buro Clinic
          </div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Cormorant", data: await cormorant, style: "normal", weight: 400 },
        { name: "Onest", data: await onest, style: "normal", weight: 400 },
      ],
    },
  );
}
