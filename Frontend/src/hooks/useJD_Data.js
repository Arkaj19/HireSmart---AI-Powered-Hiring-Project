import {useCallback, useEffect,useState} from "react"
function useJD_Data(){
    const [jds,setJds]=useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback( async () => {
        setLoading(true);
        try{
            const res = await fetch("http://127.0.0.1:8000/jds");
            const data = await res.json();
            setJds(data);
        }
        catch(error)
        {
            console.log( "Error Fetching JDs:", err);
        }finally{
            setLoading(false);
        }
    }, [])

    // useEffect(()=>{
    //     const fetchData=async()=>{
            
    //     try{
    //         const res=await fetch("http://127.0.0.1:8000/jds");
    //         const data=await res.json();
    //         getJds(data);

    //     }
    //     catch(err){ 
    //         console.error("Error fetching JDs:", err);
    //     }
    // }
    //     fetchData();
    // },[])
    
    useEffect(() => {
        fetchData();
    }, [fetchData]);
    
    // Return both data and refetch function
     return { jds, loading, refresh: fetchData };
}

export default useJD_Data;