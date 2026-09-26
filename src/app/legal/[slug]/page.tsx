import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Container } from "@/components/ui/container";
import { getLegalDoc, legalDocs, type LegalBlock } from "@/content/legal";
import { pageMetadata } from "@/lib/metadata";

/**
 * Юридические страницы: политика, согласие, соглашение.
 *
 * Одна колонка текста шириной для чтения, без анимаций: эти страницы
 * открывают, чтобы найти конкретный пункт, а не любоваться.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return legalDocs.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/legal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const doc = getLegalDoc(slug);
  if (!doc) return {};
  return pageMetadata({
    title: doc.title,
    description: doc.description,
    path: `/legal/${slug}`,
    // Черновик в поиске не нужен: снимем запрет вместе с пометкой.
    noindex: doc.draft,
  });
}

function Block({ block }: { block: LegalBlock }) {
  if (Array.isArray(block)) {
    return (
      <ul className="flex list-disc flex-col gap-2 pl-6 marker:text-smoke">
        {block.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }
  return <p>{block}</p>;
}

export default async function LegalPage({ params }: PageProps<"/legal/[slug]">) {
  const { slug } = await params;
  const doc = getLegalDoc(slug);
  if (!doc) notFound();

  const others = legalDocs.filter((d) => d.slug !== doc.slug);

  return (
    <section className="bg-cream">
      <Container className="flex flex-col gap-12 py-20 lg:py-28">
        <div className="flex max-w-3xl flex-col gap-6">
          <Breadcrumbs
            items={[
              { name: "О клинике", href: "/about" },
              { name: doc.title, href: `/legal/${doc.slug}` },
            ]}
          />
          <h1 className="font-display text-heading-lg text-balance text-ink">{doc.title}</h1>
          <p className="label-mono text-graphite">Редакция от {doc.updatedAt}</p>
          {doc.draft ? (
            <p className="label-mono self-start rounded-button border border-hairline px-3 py-2 text-graphite">
              Черновик · текст согласовывается с юристом клиники
            </p>
          ) : null}
        </div>

        <article className="flex max-w-3xl flex-col gap-10 text-ink">
          {doc.sections.map((section) => (
            <section key={section.heading} className="flex flex-col gap-4">
              <h2 className="font-display text-heading-sm">{section.heading}</h2>
              <div className="flex flex-col gap-4 text-graphite">
                {section.blocks.map((block, i) => (
                  <Block key={i} block={block} />
                ))}
              </div>
            </section>
          ))}
        </article>

        <nav aria-label="Другие документы" className="flex max-w-3xl flex-col gap-3 border-t border-hairline pt-8">
          {others.map((d) => (
            <Link
              key={d.slug}
              href={`/legal/${d.slug}`}
              className="text-ink underline underline-offset-4 hover:text-sky"
            >
              {d.title}
            </Link>
          ))}
        </nav>
      </Container>
    </section>
  );
}
