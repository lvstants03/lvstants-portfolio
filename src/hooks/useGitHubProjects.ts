"use client";

import { useState, useEffect } from "react";
import { GitHubRepo } from "@/app/api/github/route";

export function useGitHubProjects() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<string>("loading");

  useEffect(() => {
    let isMounted = true;

    async function fetchRepos() {
      try {
        setLoading(true);
        const res = await fetch("/api/github");
        if (!res.ok) throw new Error("Failed to fetch GitHub repositories");
        const json = await res.json();
        
        if (isMounted && json.success && Array.isArray(json.data)) {
          setRepos(json.data);
          setSource(json.source || "github_live");
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchRepos();

    return () => {
      isMounted = false;
    };
  }, []);

  return { repos, loading, error, source };
}
