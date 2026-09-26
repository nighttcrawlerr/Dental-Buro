import { doctors } from "@/content/site";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image";

/** Превью страницы врача: имя и специальность. Когда появятся портреты — добавить фото. */
export const alt = "Врач клиники Dental Buro";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return doctors.map((d) => ({ slug: d.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doctor = doctors.find((d) => d.slug === slug);

  return renderOgImage({
    eyebrow: "Врачи",
    title: doctor?.name ?? "Врачи",
    note: doctor ? `${doctor.role}, ${doctor.experience}` : undefined,
  });
}
