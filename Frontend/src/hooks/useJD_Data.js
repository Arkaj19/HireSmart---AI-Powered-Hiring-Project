import {useEffect,useState} from "react"
function useJD_Data(){
    const [jds,getJds]=useState([]);
    useEffect(()=>{
        const fetchData=async()=>{
        try{
            const res=await fetch("http://127.0.0.1:8000/jds");
            const data=await res.json();
            getJds(data);

        }
        catch(err){ 
            console.error("Error fetching JDs:", err);
        }
    }
        fetchData();
    },[])
    return jds;
}
export default useJD_Data;