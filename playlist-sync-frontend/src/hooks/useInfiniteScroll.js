import { useEffect, useRef } from "react";

export function useInfiniteScroll(callback) {
    const observerRef = useRef(null);

    useEffect(() => {
        if (observerRef.current) observerRef.current.disconnect();
        console.log("here")

        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    callback();
                }
            },
            { threshold: 0.5 }
        );

        return () => observerRef.current?.disconnect();
    }, [callback]);

    return (node) => {
        if (node) observerRef.current.observe(node);
    };
}
