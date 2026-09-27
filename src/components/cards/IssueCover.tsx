import Image from "next/image";
import { cn } from "@/lib/utils";

/** Magazine cover with a gentle 3D tilt + float, used on home, issue and membership pages. */
export function IssueCover({ src, alt, badge, className, priority, sizes = "(min-width: 1024px) 380px, 70vw" }: { src: string; alt: string; badge?: string; className?: string; priority?: boolean; sizes?: string }) {
  return (
    <div className={cn("group relative mx-auto w-full max-w-[380px] [perspective:1400px]", className)}>
      <div aria-hidden className="absolute -inset-6 -z-10 rounded-full bg-cta/20 blur-3xl" />
      <div className="relative animate-float transition-transform duration-700 ease-out-soft [transform:rotateY(-10deg)_rotateX(4deg)] [transform-style:preserve-3d] group-hover:[transform:rotateY(0deg)_rotateX(0deg)_scale(1.02)]">
        <div className="relative aspect-[1240/1754] overflow-hidden rounded-md shadow-cover ring-1 ring-black/10">
          <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" />
          <span aria-hidden className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/30 to-transparent" />
          <span aria-hidden className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-white/25 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        </div>
        {badge && <span className="absolute -right-3 top-6 rounded-md bg-accent px-3 py-1.5 text-xs font-bold text-white shadow-lg">{badge}</span>}
      </div>
    </div>
  );
}
