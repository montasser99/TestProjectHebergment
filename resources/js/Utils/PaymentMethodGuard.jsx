import { useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function PaymentMethodGuard({ children, selectedPaymentMethod = null, strict = true }) {
    useEffect(() => {
        // Si mode strict activé et aucune méthode de paiement fournie par le serveur
        if (strict && !selectedPaymentMethod) {
            const savedPaymentMethod = localStorage.getItem('selectedPaymentMethod');
            if (!savedPaymentMethod) {
                router.visit('/client/payment-method');
                return;
            }
        }
    }, [selectedPaymentMethod, strict]);

    return children;
}