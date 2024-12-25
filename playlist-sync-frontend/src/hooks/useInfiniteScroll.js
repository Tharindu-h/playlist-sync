import { useRef, useCallback } from "react";

export function useInfiniteScroll(callback) {
    const observerRef = useRef(null);

    const setRef = useCallback((node) => {
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        // Create a new IntersectionObserver
        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    callback();
                }
            },
            { threshold: 0.5 } // Trigger when 50% of the element is visible
        );

        // Attach the observer to the node
        if (node) {
            observerRef.current.observe(node);
        }
    }, [callback]);

    return setRef;
}
