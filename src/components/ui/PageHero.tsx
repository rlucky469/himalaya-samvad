import Image from "next/image";
import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  eyebrow?: ReactNode;
  image: string;
  breadcrumbs: Crumb[];
  children?: ReactNode;
  size?: "md" | "lg";
  aside?: ReactNode;
}

/** Navy hero used on inner pages: misty mountain photo, breadcrumb, title and optional actions. */
export function PageHero({ title, subtitle, eyebrow, image, breadcrumbs, children, size = "md", aside }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-primary-deep text-white">
      <Image src={image} alt="" fill priority sizes="100vw" className="-z-20 animate-ken-burns object-cover opacity-45" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-primary-deep via-primary-deep/85 to-primary/40" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-mountain-silhouette opacity-80" />
      <div className={cn("container-site relative", size === "lg" ? "py-16 sm:py-24" : "py-12 sm:py-16 lg:py-20")}>
        <div className={cn("flex flex-col gap-10", aside && "lg:flex-row lg:items-center lg:justify-between")}>
          <div className="max-w-3xl">
            <Breadcrumbs items={breadcrumbs} />
            {eyebrow && <div className="mt-6">{eyebrow}</div>}
            <h1 className="mt-5 animate-fade-up text-4xl text-white sm:text-5xl lg:text-[3.4rem]">{title}</h1>
            <span aria-hidden className="mt-5 block h-1 w-16 animate-fade-up rounded-full bg-cta [animation-delay:120ms]" />
            {subtitle && <p className="mt-5 max-w-2xl animate-fade-up text-lg text-on-dark-muted [animation-delay:200ms] sm:text-xl">{subtitle}</p>}
            {children && <div className="mt-8 flex animate-fade-up flex-wrap gap-3 [animation-delay:280ms]">{children}</div>}
          </div>
          {aside && <div className="animate-fade-up [animation-delay:300ms]">{aside}</div>}
        </div>
      </div>
    </section>
  );
}
