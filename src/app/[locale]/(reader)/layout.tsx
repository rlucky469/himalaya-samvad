// The reader is full-screen: no site header, footer or WhatsApp button
export default function ReaderLayout({ children }: LayoutProps<"/[locale]">) {
  return <main id="main">{children}</main>;
}
