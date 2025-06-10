//хук будет вызывать callback когда попадает div на экран

import { useCallback, useRef } from "react";

//это нужно для Infinity подгрузки
export function useIntersection(onIntersect: () => void) {
  const unsibscribe = useRef(() => {});

  return useCallback((el: HTMLDivElement | null) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((intersection) => {
        if (intersection.isIntersecting) {
          onIntersect();
        }
      });
    });
    if (el) {
      observer.observe(el);
      unsibscribe.current = () => observer.disconnect();
    } else {
      unsibscribe.current();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
