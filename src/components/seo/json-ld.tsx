/**
 * Разметка Schema.org в формате JSON-LD.
 *
 * «<» экранируется: JSON-LD вставляется в страницу как текст скрипта, и
 * строка «</script>» внутри данных закрыла бы тег раньше времени.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
