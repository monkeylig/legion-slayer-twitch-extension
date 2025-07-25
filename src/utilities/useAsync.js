import { useEffect, useState } from "react";

/**
 * @template {any} TReturnType
 * 
 * @param {() => Promise<TReturnType>} asyncFunction 
 * @returns {[TReturnType|null, boolean, any]}
 */
function useAsync(asyncFunction) {
    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        asyncFunction()
        .then(data => {
            setIsPending(false);
            setData(data);
        })
        .catch(error => {
            setIsPending(false);
            setError(error);
        });
    }, [asyncFunction]);

    return [data, isPending, error];
}

export default useAsync;
