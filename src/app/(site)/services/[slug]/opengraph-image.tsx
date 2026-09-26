import { services } from "@/content/site";
import { formatPriceFrom } from "@/lib/format";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image";

/** Превью страницы услуги: название и цена «от» — то, что решает клик. */
export const alt = "Услуга клиники Dental Buro";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);

  return renderOgImage({
    eyebrow: "Услуги",
    title: service?.title ?? "Услуги",
    note: service ? formatPriceFrom(service.priceFrom) : undefined,
  });
}
