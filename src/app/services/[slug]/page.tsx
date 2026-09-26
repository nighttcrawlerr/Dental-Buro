import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DoctorCard } from "@/components/doctors/doctor-card";
import { BookButton } from "@/components/lead/book-button";
import { SiteLeadForm } from "@/components/lead/site-lead-form";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { RevealWords } from "@/components/ui/reveal-words";
import { SectionHeading } from "@/components/ui/section-heading";
import { Tag } from "@/components/ui/tag";
import { getFeaturedPrices } from "@/content/prices";
import { getServiceDetails } from "@/content/service-details";
import { clinic, doctors, serviceGroups, services } from "@/content/site";
import { formatPriceFrom, formatPriceItem } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";

/**
 * Страница услуги — основная посадочная под поиск и рекламу.
 *
 * Порядок блоков повторяет вопросы, которые человек задаёт себе сам, в том
 * порядке, в каком задаёт: что это и сколько стоит → что входит → как это
 * будет → моё ли это → точные цены → кто будет лечить → а если… → записаться.
 *
 * Форма записи стоит в конце страницы, и услуга в ней уже выбрана. Кнопка в
 * первом экране открывает окно для тех, кто решил сразу.
 */

// Страниц ровно столько, сколько услуг. Чужой адрес — 404, а не пустой шаблон.
export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

function findService(slug: string) {
  const service = services.find((s) => s.slug === slug);
  const details = getServiceDetails(slug);
  return service && details ? { service, details } : null;
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const found = findService(slug);
  if (!found) return {};

  return pageMetadata({
    title: `${found.service.title} — ${formatPriceFrom(found.service.priceFrom)}`,
    description: found.details.intro,
    path: `/services/${slug}`,
  });
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const found = findService(slug);
  if (!found) notFound();

  const { service, details } = found;
  const group = serviceGroups.find((g) => g.id === service.group);
  const prices = getFeaturedPrices(service.slug);
  const serviceDoctors = doctors.filter((d) => d.services.includes(service.slug));

  return (
    <>
      {/* ---- Первый экран ---------------------------------------------- */}
      <section className="bg-espresso">
        <Container className="flex flex-col gap-12 py-16 lg:gap-16 lg:py-24">
          <nav aria-label="Хлебные крошки" className="label-mono text-stone">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/services" className="transition-colors hover:text-cream">
                  Услуги
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-cream">
                {service.title}
              </li>
            </ol>
          </nav>

          <div className="flex max-w-4xl flex-col gap-8">
            {group ? <Tag surface="dark">{group.label}</Tag> : null}
            <h1 className="font-display text-display-xl text-balance text-cream">
              <RevealWords text={`${service.title}.`} trigger="load" />
            </h1>
            <Reveal trigger="load" index={2}>
              <p className="max-w-2xl text-body-lg text-stone">{details.intro}</p>
            </Reveal>
          </div>

          <Reveal trigger="load" index={3} className="flex flex-col gap-10">
            <dl className="grid gap-6 border-t border-hairline-dark pt-8 sm:grid-cols-2 lg:max-w-2xl">
              <div className="flex flex-col gap-2">
                <dt className="label-mono text-cream/60">Стоимость</dt>
                <dd className="font-display text-heading-sm text-cream">
                  {formatPriceFrom(service.priceFrom)}
                </dd>
              </div>
              <div className="flex flex-col gap-2">
                <dt className="label-mono text-cream/60">Срок лечения</dt>
                <dd className="font-display text-heading-sm text-cream">{details.duration}</dd>
              </div>
            </dl>

            <div className="flex flex-wrap gap-3">
              <BookButton surface="dark">Записаться на консультацию</BookButton>
              <Button surface="dark" variant="ghost" href={clinic.phoneHref}>
                {clinic.phone}
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ---- Что входит ------------------------------------------------ */}
      <section className="bg-cream">
        <Container className="flex flex-col gap-12 py-20 lg:py-28">
          <SectionHeading className="reveal" title="Что входит" />
          {/* Сетка на линиях появляется целиком — см. ServicesGrid. */}
          <ul className="reveal grid gap-px overflow-hidden rounded-card bg-hairline md:grid-cols-3">
            {service.highlights.map((item, index) => (
              <li key={item} className="flex flex-col gap-6 bg-paper p-8 lg:p-10">
                <span className="label-mono text-graphite">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-body-lg text-ink">{item}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ---- Как проходит ---------------------------------------------- */}
      <section className="bg-sky">
        <Container className="flex flex-col gap-12 py-20 lg:py-28">
          <SectionHeading
            className="reveal"
            surface="sky"
            title="Как проходит лечение"
            description={`Обычно ${details.duration}. Точный срок и сумму вы узнаёте на втором шаге — до начала лечения.`}
          />
          <ol className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {details.stages.map((stage, index) => (
              <Reveal
                as="li"
                key={stage.title}
                index={index}
                className="flex flex-col gap-4 border-t border-hairline-sky pt-6"
              >
                <span className="label-mono text-sky-pale">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-heading-sm text-cream">{stage.title}</h3>
                <p className="text-cream/85">{stage.text}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* ---- Показания и цены ------------------------------------------ */}
      <section className="bg-cream">
        <Container className="grid gap-16 py-20 lg:grid-cols-2 lg:gap-20 lg:py-28">
          <div className="reveal flex flex-col gap-8">
            <SectionHeading title="Когда обращаться" />
            <ul className="flex flex-col">
              {details.indications.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-4 border-t border-hairline py-4 last:border-b"
                >
                  <span aria-hidden="true" className="mt-3 size-1.5 shrink-0 rounded-full bg-sky" />
                  <span className="text-body-lg text-ink">{item}</span>
                </li>
              ))}
            </ul>
            {/* Обязательное предупреждение для страниц с описанием медицинских
                услуг. Не мелким шрифтом в подвале, а рядом с показаниями —
                там, где его действительно прочтут. */}
            <p className="label-mono text-graphite">
              Имеются противопоказания. Необходима консультация специалиста.
            </p>
          </div>

          <div className="reveal flex flex-col gap-8">
            <SectionHeading title="Цены" />
            <table className="w-full border-collapse">
              <caption className="sr-only">Цены на услуги направления «{service.title}»</caption>
              <thead className="sr-only">
                <tr>
                  <th scope="col">Услуга</th>
                  <th scope="col">Цена</th>
                </tr>
              </thead>
              <tbody>
                {prices.map((row) => (
                  <tr key={row.name} className="border-t border-hairline last:border-b">
                    <th scope="row" className="py-4 pr-6 text-left font-normal text-ink">
                      {row.name}
                    </th>
                    <td className="label-mono py-4 text-right whitespace-nowrap text-ink">
                      {formatPriceItem(row)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-graphite">
              Точная сумма зависит от клинической ситуации и фиксируется в плане лечения после
              осмотра. Все позиции направления — в{" "}
              <Link
                href={`/prices#${service.slug}`}
                className="text-ink underline underline-offset-2 hover:text-sky"
              >
                полном прейскуранте
              </Link>
              .
            </p>
          </div>
        </Container>
      </section>

      {/* ---- Врачи ----------------------------------------------------- */}
      {serviceDoctors.length ? (
        <section className="border-t border-hairline bg-cream">
          <Container className="flex flex-col gap-12 py-20 lg:py-28">
            <SectionHeading
              className="reveal"
              title={serviceDoctors.length === 1 ? "Врач направления" : "Врачи направления"}
            />
            <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {serviceDoctors.map((doctor, index) => (
                <Reveal as="li" key={doctor.slug} index={index}>
                  <DoctorCard doctor={doctor} />
                </Reveal>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      {/* ---- Вопросы --------------------------------------------------- */}
      <section className="border-t border-hairline bg-cream">
        <Container className="grid gap-12 py-20 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-20 lg:py-28">
          <SectionHeading className="reveal lg:sticky lg:top-28 lg:self-start" title="Вопросы" />

          {/* Нативный details: раскрывается с клавиатуры, находится поиском
              по странице и не требует ни строчки скрипта. */}
          <div className="reveal flex flex-col">
            {details.faq.map((item) => (
              <details key={item.question} className="group border-t border-hairline last:border-b">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                  <span className="font-display text-heading-sm text-ink">{item.question}</span>
                  <span
                    aria-hidden="true"
                    className="flex size-11 shrink-0 items-center justify-center rounded-button border border-hairline text-ink transition-transform duration-300 group-open:rotate-45"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      className="size-5"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </summary>
                <p className="max-w-2xl pb-8 text-body-lg text-graphite">{item.answer}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      {/* ---- Запись ---------------------------------------------------- */}
      <section id="booking" className="bg-espresso">
        <Container className="grid gap-12 py-20 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-20 lg:py-28">
          <div className="flex flex-col gap-6">
            <h2 className="font-display text-heading-lg text-balance text-cream">
              <RevealWords text="Запишитесь на консультацию" />
            </h2>
            <p className="text-body-lg text-stone">
              На первом визите врач осмотрит, сделает снимки и составит план с фиксированной
              стоимостью. Решение о лечении вы принимаете уже после.
            </p>
            <a
              href={clinic.phoneHref}
              className="font-display text-heading-sm text-cream transition-opacity hover:opacity-80"
            >
              {clinic.phone}
            </a>
          </div>

          <SiteLeadForm surface="dark" defaultService={service.slug} />
        </Container>
      </section>
    </>
  );
}
