"use client"

import { useEffect, useState } from "react"

interface VerticalNavProps {
  activeSection: string | undefined;
  sectionIds: string[];
}

export const VerticalNav = ({ activeSection, sectionIds }: VerticalNavProps) => {
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    // Theo dõi Footer
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const footer = document.querySelector("footer");
    if (footer) observer.observe(footer);

    return () => {
      if (footer) observer.unobserve(footer);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div 
      className={`fixed right-2 md:right-6 top-1/2 -translate-y-1/2 z-[100] hidden md:flex flex-col items-end gap-1 transition-all duration-700
        ${isFooterVisible 
          ? "opacity-0 pointer-events-none translate-x-10" 
          : "opacity-100 translate-x-0"
        }
      `}
    >
      {sectionIds.map((id) => {
        const isActive = activeSection === id;
        return (
          <button
            key={id}
            onClick={() => scrollToSection(id)}
            className="group relative flex items-center justify-end py-3 px-3 md:px-6 outline-none"
            aria-label={`Scroll to ${id}`}
          >
            <span 
              className={`mr-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 pointer-events-none hidden lg:block
                ${isActive 
                  ? 'opacity-100 text-yellow-500 translate-x-0' 
                  : 'opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 text-zinc-500'
                }`}
            >
              {id}
            </span>
            
            <div className="relative flex items-center justify-center w-4 md:w-6">
              <div 
                className={`transition-all duration-500 rounded-full ${
                  isActive 
                  ? 'w-1 md:w-[3px] h-8 md:h-10 bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]' 
                  : 'w-1 h-1 md:w-[2px] md:h-3 bg-zinc-700 group-hover:bg-zinc-400 group-hover:h-6'
                }`} 
              />
            </div>
          </button>
        );
      })}
    </div>
  );
};