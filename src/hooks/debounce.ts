import { useEffect, useRef } from "react";

export const useDebounce = () => {
    const timeout = useRef<number | null>(null);

    const debounce = <T extends () => void>(fn: T, delay: number = 300) => {
        if (timeout.current) clearTimeout(timeout.current);

        timeout.current = setTimeout(() => {
            fn();
            timeout.current = null;
        }, delay);
    }

    useEffect(() => {
        return () => {
            if (timeout.current) {
                clearTimeout(timeout.current);
            }
        }
    }, []);

    return debounce;
}


export const useDebounced = <T extends (...args: Parameters<T>) => void>(fn: T, delay: number = 300) => {
    const timeout = useRef<number | null>(null);

    const debounce = (...args: Parameters<T>) => {
        if (timeout.current) clearTimeout(timeout.current);

        timeout.current = setTimeout(() => {
            fn(...args);
            timeout.current = null;
        }, delay);
    }

    useEffect(() => {
        return () => {
            if (timeout.current) {
                clearTimeout(timeout.current);
            }
        }
    }, []);

    return debounce;
}

// inside a component / hook

const debouncedSearch = useDebounced((query: string) => { console.log(query) })

debouncedSearch("something")