import { useState, useEffect } from "react";

const TimedParagraph = (message, duration) => {
    const [showParagraph, setShowParagraph] = useState(true);

    useEffect(() => {
        // Définit le minuteur pour masquer le paragraphe après 10 secondes
        const timer = setTimeout(() => {
            setShowParagraph(false);
        }, duration); // 10000 millisecondes = 10 secondes

        // 3. Fonction de nettoyage pour annuler le minuteur
        return () => {
            clearTimeout(timer);
        };
    }, [duration]); // Le tableau vide indique que l'effet ne s'exécute qu'une seule fois au montage du composant

    return (
        <div >
            {/* Affiche le paragraphe uniquement si showParagraph est true */}
            {showParagraph && message}
        </div>
    );
};

export default TimedParagraph;