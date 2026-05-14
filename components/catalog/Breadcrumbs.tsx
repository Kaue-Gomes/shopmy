import Link from 'next/link'

export type Crumb = { label: string; href: string }

export function CatalogBreadcrumbs({ items }: { items: Crumb[] }) {
  const base = (process.env.NEXT_PUBLIC_APP_URL || '').replace(/\/$/, '')

  const jsonLd =
    items.length === 0
      ? null
      : {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: items.map((item, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: item.label,
            item: item.href.startsWith('http')
              ? item.href
              : `${base}${item.href.startsWith('/') ? '' : '/'}${item.href}`,
          })),
        }

  return (
    <>
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-6">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {items.map((item, i) => {
            const last = i === items.length - 1
            return (
              <li key={`${item.href}-${i}`} className="flex items-center gap-2">
                {last ? (
                  <span className="font-medium text-foreground max-w-[12rem] sm:max-w-xl truncate">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:text-primary transition-colors truncate max-w-[10rem]"
                  >
                    {item.label}
                  </Link>
                )}
                {!last ? (
                  <span className="text-muted-foreground/60" aria-hidden>
                    /
                  </span>
                ) : null}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
