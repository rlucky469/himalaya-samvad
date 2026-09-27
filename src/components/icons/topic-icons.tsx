import { GraduationCap, HeartPulse, Music, TrendingUp, Trees, UsersRound, type LucideProps } from "lucide-react";

/** Icon for a topic slug (static switch keeps components out of render-time lookups). */
export function TopicIcon({ slug, ...props }: { slug: string } & LucideProps) {
  switch (slug) {
    case "culture":
      return <Music {...props} />;
    case "environment":
      return <Trees {...props} />;
    case "education":
      return <GraduationCap {...props} />;
    case "health":
      return <HeartPulse {...props} />;
    case "development":
      return <TrendingUp {...props} />;
    default:
      return <UsersRound {...props} />;
  }
}
