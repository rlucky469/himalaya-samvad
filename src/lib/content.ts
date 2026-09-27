import "server-only";
import { getMessages } from "next-intl/server";
import type { Article, Issue, Messages, TeamMember, Topic } from "@/types/content";

/** Server-side access to the current locale's content JSON. */
export async function getContent(): Promise<Messages> {
  return (await getMessages()) as Messages;
}

export async function getArticles(): Promise<Article[]> {
  return (await getContent()).articles.items;
}

export async function getArticle(slug: string): Promise<Article | undefined> {
  return (await getArticles()).find((a) => a.slug === slug);
}

export async function getTopics(): Promise<Topic[]> {
  return (await getContent()).topics.items;
}

export async function getTopic(slug: string): Promise<Topic | undefined> {
  return (await getTopics()).find((t) => t.slug === slug);
}

export async function getIssues(): Promise<Issue[]> {
  return (await getContent()).issues.items;
}

export async function getIssue(slug: string): Promise<Issue | undefined> {
  return (await getIssues()).find((i) => i.slug === slug);
}

export async function getTeam(): Promise<TeamMember[]> {
  return (await getContent()).team.members;
}

export function articlesByTopic(articles: Article[], topic: string) {
  return articles.filter((a) => a.topic === topic);
}

export function articlesInIssue(articles: Article[], issueSlug: string) {
  return articles.filter((a) => a.issueSlug === issueSlug).sort((a, b) => a.page - b.page);
}
