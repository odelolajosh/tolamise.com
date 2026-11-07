export function Tags({ tags, label }: { tags?: Array<string>; label: string }) {
  if (!tags?.length) return null
  return (
    <ul aria-label={label} className="m-0 flex flex-wrap gap-2 list-none">
      {tags.map((tag) => (
        <li
          key={tag}
          className="m-0 rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground"
        >
          {tag}
        </li>
      ))}
    </ul>
  )
}
