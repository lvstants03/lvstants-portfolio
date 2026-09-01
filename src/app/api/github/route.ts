import { NextResponse } from "next/server";
import projectsFallback from "@/data/projects.json";

export interface GitHubRepo {
  id: number;
  name: string;
  fullName: string;
  description: string;
  url: string;
  homepage?: string;
  language: string;
  stars: number;
  forks: number;
  topics: string[];
  updatedAt: string;
  isFork: boolean;
  image: string;
}

export async function GET() {
  const username = "lvstants03";
  const token = process.env.GITHUB_TOKEN;

  const headers: HeadersInit = {
    "Accept": "application/vnd.github.v3+json",
    "User-Agent": "Portfolio-App",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=pushed&direction=desc&per_page=50`,
      {
        headers,
        next: { revalidate: 3600 }, // Cache 1 giờ với ISR
      }
    );

    if (!response.ok) {
      console.warn(`GitHub API returned status ${response.status}. Using fallback data.`);
      return NextResponse.json({
        success: true,
        source: "fallback",
        data: formatFallbackData(),
      });
    }

    const repos = await response.json();

    if (!Array.isArray(repos)) {
      return NextResponse.json({
        success: true,
        source: "fallback",
        data: formatFallbackData(),
      });
    }

    // Filter non-forked public repositories
    const formattedRepos: GitHubRepo[] = repos
      .filter((repo: { fork: boolean; private: boolean }) => !repo.private)
      .map((repo: {
        id: number;
        name: string;
        full_name: string;
        description: string | null;
        html_url: string;
        homepage: string | null;
        language: string | null;
        stargazers_count: number;
        forks_count: number;
        topics: string[] | null;
        pushed_at: string;
        fork: boolean;
      }) => ({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description || "Du an phat trien ma nguon mo boi lvstants03 tren GitHub.",
        url: repo.html_url,
        homepage: repo.homepage || undefined,
        language: repo.language || "TypeScript",
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        topics: repo.topics || [],
        updatedAt: repo.pushed_at,
        isFork: repo.fork,
        image: `https://opengraph.githubassets.com/1/${username}/${repo.name}`,
      }));

    return NextResponse.json({
      success: true,
      source: "github_live",
      total: formattedRepos.length,
      data: formattedRepos,
    });
  } catch (error) {
    console.error("Error fetching GitHub repos:", error);
    return NextResponse.json({
      success: true,
      source: "fallback",
      data: formatFallbackData(),
    });
  }
}

function formatFallbackData(): GitHubRepo[] {
  return projectsFallback.map((item, idx) => ({
    id: idx + 1,
    name: item.title,
    fullName: `lvstants03/${item.title}`,
    description: "Du an phat trien ma nguon mo boi lvstants03.",
    url: item.github,
    homepage: item.link,
    language: item.technologies?.[0] || "TypeScript",
    stars: 0,
    forks: 0,
    topics: item.technologies || [],
    updatedAt: new Date().toISOString(),
    isFork: false,
    image: item.image,
  }));
}
