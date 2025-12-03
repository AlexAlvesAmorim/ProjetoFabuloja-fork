export const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView ({
            behavior: "smooth",
            block: "start",
        });
    }
    
    else {
        setTimeout (() => {
            const el = document.getElementById(sectionId);
            el?.scrollIntoView ({ 
                behavior: "smooth",
                block: "start"
            });
        }, 300);
    }
};