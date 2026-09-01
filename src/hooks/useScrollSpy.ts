import { useEffect, useState, useRef } from "react";

export function useScrollSpy(ids: string[], offset = 120) {
  const [activeId, setActiveId] = useState<string | null>("home");
  const tickingRef = useRef(false);

  useEffect(() => {
    // 1. Thử nghiệm tối ưu bằng IntersectionObserver
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: "-25% 0px -65% 0px",
      threshold: 0,
    });

    const elements: HTMLElement[] = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
        elements.push(el);
      }
    });

    // 2. Fallback nhẹ nhàng với requestAnimationFrame (chống lag cuộn)
    const handleScroll = () => {
      if (!tickingRef.current) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY + offset;
          let currentId: string | null = null;

          for (let i = 0; i < elements.length; i++) {
            const el = elements[i];
            if (scrollPosition >= el.offsetTop) {
              currentId = el.id;
            }
          }

          if (currentId) {
            setActiveId((prev) => (prev !== currentId ? currentId : prev));
          }
          tickingRef.current = false;
        });
        tickingRef.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [ids, offset]);

  return activeId;
}
