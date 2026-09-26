import type { ServiceFaq } from "@/content/service-details";
import { clinic, type Doctor, type Service } from "@/content/site";
import { absoluteUrl } from "./site-url";

/**
 * Разметка Schema.org для поисковиков.
 *
 * Клиника описана один раз и дальше упоминается по @id — так Яндекс и
 * Google понимают, что услуги и врачи относятся к одной организации.
 *
 * Рейтинга (AggregateRating) нет и не будет, пока нет настоящих оценок:
 * выдуманный рейтинг в разметке — прямое нарушение правил поисковиков, за
 * него снимают расширенные сниппеты со всего сайта.
 */

const clinicId = absoluteUrl("/#clinic");

export function clinicSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "@id": clinicId,
    name: clinic.legalName,
    url: absoluteUrl("/"),
    image: absoluteUrl("/opengraph-image"),
    telephone: clinic.phoneHref.replace("tel:", ""),
    email: clinic.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: clinic.address,
      addressCountry: "RU",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: clinic.hours.days.map((d) => `https://schema.org/${dayNames[d]}`),
      opens: clinic.hours.opens,
      closes: clinic.hours.closes,
    },
    currenciesAccepted: "RUB",
  };
}

const dayNames: Record<string, string> = {
  Mo: "Monday",
  Tu: "Tuesday",
  We: "Wednesday",
  Th: "Thursday",
  Fr: "Friday",
  Sa: "Saturday",
  Su: "Sunday",
};

/** Услуга с ценой «от». */
export function serviceSchema(service: Service, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: service.title,
    description,
    url: absoluteUrl(`/services/${service.slug}`),
    // У MedicalProcedure нет своей цены — цену и исполнителя несёт
    // предложение (Offer), привязанное к клинике.
    offers: {
      "@type": "Offer",
      priceCurrency: "RUB",
      price: service.priceFrom,
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice: service.priceFrom,
        priceCurrency: "RUB",
      },
      offeredBy: { "@id": clinicId },
    },
  };
}

export function faqSchema(faq: ServiceFaq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/**
 * Врач. Тип Physician в Schema.org — это организация (частная практика),
 * а не человек, поэтому врач клиники описывается как Person с должностью
 * и местом работы.
 */
export function doctorSchema(doctor: Doctor) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: doctor.name,
    jobTitle: doctor.role,
    url: absoluteUrl(`/doctors/${doctor.slug}`),
    worksFor: { "@id": clinicId },
  };
}

export function breadcrumbSchema(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}
