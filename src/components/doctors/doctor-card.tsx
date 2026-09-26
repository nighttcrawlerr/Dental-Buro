import Link from "next/link";
import { PhotoPlaceholder } from "@/components/ui/photo-placeholder";
import type { Doctor } from "@/content/site";

/**
 * Короткая карточка врача: портрет, имя, специальность, стаж, направления.
 * Полные сведения, которые требует закон, — на странице врача.
 */
export function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <Link href={`/doctors/${doctor.slug}`} className="group flex flex-col gap-5">
      <PhotoPlaceholder label="Портрет врача" decorative />

      <span className="flex flex-col gap-2">
        <span className="font-display text-subheading text-ink">{doctor.name}</span>
        <span className="label-mono text-sky">{doctor.role}</span>
        <span className="label-mono text-graphite">{doctor.experience}</span>
      </span>

      <span className="text-graphite">{doctor.focus}</span>
    </Link>
  );
}
