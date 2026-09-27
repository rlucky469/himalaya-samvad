import type { ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "navy" | "outline" | "light" | "outlineLight" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex select-none items-center justify-center gap-2 rounded-lg font-semibold leading-none whitespace-nowrap transition-all duration-300 ease-out-soft focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-60 active:scale-[0.98]";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-cta text-white shadow-cta hover:-translate-y-0.5 hover:bg-cta-hover",
  navy: "bg-primary text-white shadow-card hover:-translate-y-0.5 hover:bg-primary-dark",
  outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
  light: "bg-white text-primary shadow-card hover:-translate-y-0.5 hover:bg-primary-tint",
  outlineLight: "border border-white/40 bg-white/5 text-white backdrop-blur-sm hover:border-white hover:bg-white/15",
  ghost: "text-primary hover:bg-primary-tint",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-4 py-2.5 text-sm",
  md: "px-5 py-3.5 text-base",
  lg: "px-7 py-4 text-lg",
};

export function buttonClasses(variant: ButtonVariant = "primary", size: ButtonSize = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: "start" | "end";
  children: ReactNode;
  className?: string;
}

function Content({ icon, iconPosition = "end", children }: Pick<CommonProps, "icon" | "iconPosition" | "children">) {
  return (
    <>
      {icon && iconPosition === "start" && <span className="shrink-0 [&>svg]:size-[1.15em]">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === "end" && (
        <span className="shrink-0 transition-transform duration-300 group-hover/btn:translate-x-0.5 [&>svg]:size-[1.15em]">{icon}</span>
      )}
    </>
  );
}

export function Button({ variant, size, icon, iconPosition, children, className, ...props }: CommonProps & Omit<ComponentProps<"button">, "children">) {
  return (
    <button className={buttonClasses(variant, size, className)} {...props}>
      <Content icon={icon} iconPosition={iconPosition}>
        {children}
      </Content>
    </button>
  );
}

type LinkHref = ComponentProps<typeof Link>["href"];

/** Internal links use the locale-aware Link; #anchors, mailto:, tel: and http(s) links render a plain <a>. */
export function ButtonLink({
  href,
  variant,
  size,
  icon,
  iconPosition,
  children,
  className,
  ...props
}: CommonProps & { href: LinkHref | string } & Omit<ComponentProps<"a">, "href" | "children">) {
  const classes = buttonClasses(variant, size, className);
  const isExternal = typeof href === "string" && /^(https?:|mailto:|tel:|#)/.test(href);

  if (isExternal) {
    const newTab = href.startsWith("http");
    return (
      <a href={href} className={classes} {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...props}>
        <Content icon={icon} iconPosition={iconPosition}>
          {children}
        </Content>
      </a>
    );
  }

  return (
    <Link href={href as LinkHref} className={classes} {...props}>
      <Content icon={icon} iconPosition={iconPosition}>
        {children}
      </Content>
    </Link>
  );
}
