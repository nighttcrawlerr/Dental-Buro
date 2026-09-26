import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { cn } from "@/lib/cn";
import { breadcrumbSchema } from "@/lib/schema";

type Crumb = { name: string; href: string };

/**
 * Хлебные крошки: видимые и в разметке для поисковиков одновременно, из
 * одного списка — чтобы то, что видит человек, и то, что видит Яндекс, не
 * разошлось. «Главная» добавляется сама и в видимую часть не выводится:
 * на неё и так ведёт логотип.
 */
export function Breadcrumbs({
  items,
  surface = "light",
  className,
}: {
  /** От раздела до текущей страницы включительно. */
  items: Crumb[];
  surface?: "light" | "dark";
  className?: string;
}) {
  const dark = surface === "dark";

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Главная", href: "/" }, ...items])} />
      <nav
        aria-label="Хлебные крошки"
        className={cn("label-mono", dark ? "text-stone" : "text-graphite", className)}
      >
        <ol className="flex flex-wrap items-center gap-2">
          {items.map((item, index) => {
            const last = index === items.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-2">
                {last ? (
                  <span aria-current="page" className={dark ? "text-cream" : "text-ink"}>
                    {item.name}
                  </span>
                ) : (
                  <>
                    <Link
                      href={item.href}
                      className={cn("transition-colors", dark ? "hover:text-cream" : "hover:text-ink")}
                    >
                      {item.name}
                    </Link>
                    <span aria-hidden="true">/</span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
