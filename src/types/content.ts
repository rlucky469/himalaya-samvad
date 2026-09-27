import type messages from "@messages/hi.json";

// Content types are derived from the JSON itself, so they always match hi.json / en.json
export type Messages = typeof messages;
export type Article = Messages["articles"]["items"][number];
export type Topic = Messages["topics"]["items"][number];
export type Issue = Messages["issues"]["items"][number];
export type TeamMember = Messages["team"]["members"][number];
export type MembershipPlan = Messages["membership"]["plans"]["items"][number];
export type AdSlot = Messages["advertise"]["slots"]["items"][number];
export type TopicSlug = Topic["slug"];

export type BadgeTone = "primary" | "accent" | "nature" | "secondary" | "cta";
