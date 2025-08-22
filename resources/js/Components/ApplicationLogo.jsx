export default function ApplicationLogo(props) {
    return (
        <img 
            src="/images/AmazigiLogo.jpg" 
            alt="Logo Amazighi"
            className="w-32 h-32 object-contain" // Tailwind pour largeur/hauteur
            {...props}
        />
    );
}
