import { useState, useEffect, useCallback } from "react";

export function useCandidateData() {
  const [candidates, setCandidates] = useState([]);

  const fetchCandidates = useCallback(async () => {
    try {
      const res = await fetch(
        "https://hiresmart-ai-powered-hiring-project.onrender.com/candidates"
      );
      const data = await res.json();
      setCandidates(data);
    } catch (err) {
      console.error("Error fetching candidates:", err);
    }
  }, []);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  return { candidates, setCandidates, refreshCandidates: fetchCandidates };
}
