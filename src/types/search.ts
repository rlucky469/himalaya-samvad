export interface SearchItem {
  group: "pages" | "topics" | "articles";
  title: string;
  description?: string;
  href: string;
}
