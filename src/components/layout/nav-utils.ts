/** "/" matches only the home page; other items also match their sub-pages (e.g. /issues/x/read). */
export function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
