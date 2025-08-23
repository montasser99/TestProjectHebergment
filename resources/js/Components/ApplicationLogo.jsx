import { useState, useEffect } from 'react';

export default function ApplicationLogo(props) {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Vérifier le mode sombre au montage du composant
        const checkDarkMode = () => {
            const darkMode = localStorage.getItem('darkMode') === 'true' || 
                           document.documentElement.classList.contains('dark');
            setIsDark(darkMode);
        };

        checkDarkMode();

        // Observer les changements de classe sur l'élément HTML
        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => observer.disconnect();
    }, []);

    return (
        <img 
            src={isDark ? "/images/AMAZIGHI_SHOP_WHITE.png" : "/images/AMAZIGHI_SHOP_DARK.png"}
            alt="Logo Amazighi"
            className="w-32 h-32 object-contain"
            {...props}
        />
    );
}
