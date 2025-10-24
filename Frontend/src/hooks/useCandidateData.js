import { useState,useEffect } from "react";

export function useCandidateData() {
  const[candidates,setCandidates]=useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/candidates");
        const data = await res.json();
        setCandidates(data);
      } catch (err) {
        console.error("Error fetching candidates:", err);
      }
    };

    fetchData();
  }, []);

  return { candidates };
}
