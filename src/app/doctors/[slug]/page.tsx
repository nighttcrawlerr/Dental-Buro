import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookButton } from "@/components/lead/book-button";
import { SiteLeadForm } from "@/components/lead/site-lead-form";
import { ReviewCard } from "@/components/reviews/review-card";
import { Container } from "@/components/ui/container";
import { PhotoPlaceholder } from "@/components/ui/photo-placeholder";
import { Reveal } from "@/components/ui/reveal";
import { RevealWords } from "@/components/ui/reveal-words";
import { SectionHeading } from "@/components/ui/section-heading";
import { Tag } from "@/components/ui/tag";
import { clinic, doctors, reviews, services, type Credential } from "@/content/site";
import { formatPrice } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";

/**
 * Страница врача.
 *
 * Для клиники это одновременно и продающая страница, и обязательная: закон о
 * платных медицинских услугах требует публиковать образование, квалификацию
 * и стаж каждого врача. Поэтому блок с документами — не мелким шрифтом внизу,
 * а полноценная секция сразу после знакомства.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return doctors.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/doctors/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const doctor = doctors.find((d) => d.slug === slug);
  if (!doctor) return {};

  return pageMetadata({
    title: `${doctor.name}, ${doctor.role.toLowerCase()}`,
    description: `${doctor.role}, ${doctor.experience}. ${doctor.focus}. Образование, квалификация и стоимость консультации.`,
    path: `/doctors/${slug}`,
  });
}

function CredentialList({ title, items }: { title: string; items: Credential[] }) {
  return (
    <div className="flex flex-col gap-6">
      <h3 className="label-mono text-graphite">{title}</h3>
      <ul className="flex flex-col">
        {items.map((item) => (
          <li
            key={`${item.year}-${item.title}`}
            className="grid grid-cols-[4.5rem_1fr] gap-4 border-t border-hairline py-5 last:border-b"
          >
            <span className="label-mono pt-1 text-sky">{item.year}</span>
            <span className="flex flex-col gap-1">
              <span className="text-ink">{item.title}</span>
              <span className="text-graphite">{item.place}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function DoctorPage({ params }: PageProps<"/doctors/[slug]">) {
  const { slug } = await params;
  const doctor = doctors.find((d) => d.slug === slug);
  if (!doctor) notFound();

  const doctorServices = services.filter((s) => doctor.services.includes(s.slug));
  const doctorReviews = reviews.filter((r) => r.doctor === doctor.slug);

  return (
    <>
      {/* ---- Знакомство ------------------------------------------------ */}
      <section className="bg-cream">
        <Container className="grid gap-12 py-16 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-20 lg:py-24">
          <PhotoPlaceholder label="Портрет врача" className="w-full max-w-md" />

          <div className="flex flex-col gap-10">
            <nav aria-label="Хлебные крошки" className="label-mono text-graphite">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/doctors" className="transition-colors hover:text-ink">
                    Врачи
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-ink">
                  {doctor.name}
                </li>
              </ol>
            </nav>

            <div className="flex flex-col gap-6">
              <Tag>{doctor.role}</Tag>
              <h1 className="font-display text-display text-balance text-ink">
                <RevealWords text={doctor.name} trigger="load" />
              </h1>
              <Reveal trigger="load" index={2}>
                <p className="max-w-2xl text-body-lg text-graphite">{doctor.bio}</p>
              </Reveal>
            </div>

            <Reveal trigger="load" index={3} className="flex flex-col gap-10">
              <dl className="grid gap-6 border-t border-hairline pt-8 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <dt className="label-mono text-graphite">Стаж</dt>
                  <dd className="font-display text-heading-sm text-ink">{doctor.experience}</dd>
                </div>
                <div className="flex flex-col gap-2">
                  <dt className="label-mono text-graphite">Консультация</dt>
                  <dd className="font-display text-heading-sm text-ink">
                    {formatPrice(doctor.consultationPrice)}
                  </dd>
                </div>
              </dl>

              {doctorServices.length ? (
                <div className="flex flex-col gap-4">
                  <h2 className="label-mono text-graphite">Направления</h2>
                  <ul className="flex flex-wrap gap-2">
                    {doctorServices.map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={`/services/${s.slug}`}
                          className="label-mono inline-flex min-h-11 items-center rounded-full border border-hairline px-4 text-ink transition-colors hover:border-ink"
                        >
                          {s.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <BookButton className="self-start">Записаться к врачу</BookButton>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ---- Образование и квалификация -------------------------------- */}
      <section className="border-t border-hairline bg-cream">
        <Container className="grid gap-12 py-20 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-20 lg:py-28">
          <SectionHeading
            className="reveal lg:sticky lg:top-28 lg:self-start"
            title="Образование и квалификация"
            description="Сведения опубликованы в соответствии с правилами предоставления платных медицинских услуг. Копии документов можно посмотреть в клинике."
          />
          <div className="reveal flex flex-col gap-14">
            <CredentialList title="Образование" items={doctor.education} />
            <CredentialList title="Повышение квалификации" items={doctor.training} />
          </div>
        </Container>
      </section>

      {/* ---- Отзывы ---------------------------------------------------- */}
      {doctorReviews.length ? (
        <section className="border-t border-hairline bg-cream">
          <Container className="flex flex-col gap-12 py-20 lg:py-28">
            <SectionHeading className="reveal" title="Отзывы пациентов" />
            <ul className="grid gap-6 md:grid-cols-3">
              {doctorReviews.map((review, index) => (
                <Reveal as="li" key={review.author} index={index}>
                  <ReviewCard review={review} />
                </Reveal>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      {/* ---- Запись ---------------------------------------------------- */}
      <section className="bg-espresso">
        <Container className="grid gap-12 py-20 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-20 lg:py-28">
          <div className="flex flex-col gap-6">
            <h2 className="font-display text-heading-lg text-balance text-cream">
              <RevealWords text="Запишитесь на консультацию" />
            </h2>
            <p className="text-body-lg text-stone">
              Заявка уйдёт с пометкой, что вы хотите к этому врачу, — администратор подберёт время
              в его расписании.
            </p>
            <a
              href={clinic.phoneHref}
              className="font-display text-heading-sm text-cream transition-opacity hover:opacity-80"
            >
              {clinic.phone}
            </a>
          </div>

          <SiteLeadForm
            surface="dark"
            defaultService={doctorServices[0]?.slug}
            doctor={doctor.slug}
          />
        </Container>
      </section>
    </>
  );
}
