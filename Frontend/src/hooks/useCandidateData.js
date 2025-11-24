import { useState,useEffect } from "react";

export function useCandidateData() {
  const[candidates,setCandidates]=useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://hiresmart-ai-powered-hiring-project.onrender.com/candidates");
        const data = await res.json();
        setCandidates(data);
      } catch (err) {
        console.error("Error fetching candidates:", err);
      }
    };

    fetchData();
  }, []);

  // return { candidates };
  return { candidates, setCandidates };
}
