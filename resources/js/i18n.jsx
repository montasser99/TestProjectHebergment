// resources/js/i18n.jsx
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    fr: {
        translation: {
            // Navigation
            dashboard: 'Tableau de bord',
            users: 'Utilisateurs',
            products: 'Produits',
            orders: 'Commandes',
            home: 'Accueil',
            
            // Gestion utilisateurs
            userManagement: 'Gestion des utilisateurs',
            addUser: 'Ajouter un utilisateur',
            editUser: 'Modifier l\'utilisateur',
            name: 'Nom',
            email: 'Email',
            phone: 'Téléphone',
            role: 'Rôle',
            password: 'Mot de passe',
            confirmPassword: 'Confirmer le mot de passe',
            admin: 'Administrateur',
            client: 'Client',
            status: 'Statut',
            active: 'Actif',
            blocked: 'Bloqué',
            block: 'Bloquer',
            unblock: 'Débloquer',
            
            // Actions
            add: 'Ajouter',
            edit: 'Modifier',
            delete: 'Supprimer',
            save: 'Enregistrer',
            cancel: 'Annuler',
            search: 'Rechercher',
            
            // Messages
            userCreated: 'Utilisateur créé avec succès',
            userUpdated: 'Utilisateur mis à jour avec succès',
            userDeleted: 'Utilisateur supprimé avec succès',
            userBlocked: 'Utilisateur bloqué avec succès',
            userUnblocked: 'Utilisateur débloqué avec succès',
            
            // Toasts et confirmations
            confirmDelete: 'Supprimer l\'utilisateur',
            confirmDeleteMessage: 'Êtes-vous sûr de vouloir supprimer définitivement l\'utilisateur "{{name}}" ? Cette action est irréversible.',
            confirmBlock: 'Bloquer l\'utilisateur',
            confirmUnblock: 'Débloquer l\'utilisateur',
            confirmBlockMessage: 'Êtes-vous sûr de vouloir bloquer l\'utilisateur "{{name}}" ?',
            confirmUnblockMessage: 'Êtes-vous sûr de vouloir débloquer l\'utilisateur "{{name}}" ?',
            
            // Messages de loading
            creating: 'Création de l\'utilisateur en cours...',
            updating: 'Mise à jour de l\'utilisateur en cours...',
            deleting: 'Suppression en cours...',
            blocking: 'Blocage en cours...',
            unblocking: 'Déblocage en cours...',
            
            // Messages d'erreur
            errorCreating: 'Erreur lors de la création de l\'utilisateur',
            errorUpdating: 'Erreur lors de la mise à jour de l\'utilisateur',
            errorDeleting: 'Erreur lors de la suppression',
            errorBlocking: 'Erreur lors du blocage',
            errorUnblocking: 'Erreur lors du déblocage',
            
            // Messages de succès détaillés
            userCreatedSuccess: 'Utilisateur "{{name}}" créé avec succès !',
            userUpdatedSuccess: 'Utilisateur "{{name}}" mis à jour avec succès !',
            userDeletedSuccess: 'Utilisateur "{{name}}" supprimé avec succès !',
            userBlockedSuccess: 'Utilisateur "{{name}}" bloqué avec succès !',
            userUnblockedSuccess: 'Utilisateur "{{name}}" débloqué avec succès !',
            
            // Pagination et filtres
            allRoles: 'Tous les rôles',
            noUsersFound: 'Aucun utilisateur trouvé',
            actions: 'Actions',
            previous: 'Précédent',
            next: 'Suivant',
            showingResults: 'Affichage de {{from}} à {{to}} sur {{total}} résultats',
            
            // Profil et authentification
            profile: 'Profil',
            logout: 'Déconnexion',
            updateProfile: 'Mettre à jour le profil',
            profileInformation: 'Informations du profil',
            updatePassword: 'Mettre à jour le mot de passe',
            deleteAccount: 'Supprimer le compte',
            currentPassword: 'Mot de passe actuel',
            newPassword: 'Nouveau mot de passe',
            confirmNewPassword: 'Confirmer le nouveau mot de passe',
            updateProfileDescription: 'Mettez à jour les informations de profil et l\'adresse e-mail de votre compte.',
            updatePasswordDescription: 'Assurez-vous que votre compte utilise un mot de passe long et aléatoire pour rester sécurisé.',
            deleteAccountDescription: 'Une fois votre compte supprimé, toutes ses ressources et données seront définitivement supprimées.',
       
        // Types de produits
            productTypes: 'Types de produits',
            productTypeManagement: 'Gestion des types de produits',
            addProductType: 'Ajouter un type',
            editProductType: 'Modifier le type',
            productTypeName: 'Nom du type',
            productsCount: 'Nombre de produits',
            
            // Messages types produits
            productTypeCreated: 'Type de produit créé avec succès',
            productTypeUpdated: 'Type de produit mis à jour avec succès',
            productTypeDeleted: 'Type de produit supprimé avec succès',
            productTypeCreatedSuccess: 'Type "{{name}}" créé avec succès !',
            productTypeUpdatedSuccess: 'Type "{{name}}" mis à jour avec succès !',
            productTypeDeletedSuccess: 'Type "{{name}}" supprimé avec succès !',
            
            // Confirmations
            confirmDeleteProductType: 'Supprimer le type de produit',
            confirmDeleteProductTypeMessage: 'Êtes-vous sûr de vouloir supprimer le type "{{name}}" ? Cette action est irréversible.',
            
            // Erreurs
            errorCreatingProductType: 'Erreur lors de la création du type',
            errorUpdatingProductType: 'Erreur lors de la mise à jour du type',
            errorDeletingProductType: 'Erreur lors de la suppression',
            
            // Validation
            productTypeNameRequired: 'Le nom du type est obligatoire',
            productTypeNameMax: 'Le nom ne doit pas dépasser 100 caractères',
            productTypeNameUnique: 'Ce nom de type existe déjà',
            
            // Statuts
            noProductTypesFound: 'Aucun type de produit trouvé',
            creationDate: 'Date création',
       
 // Méthodes de prix
            paymentMethods: 'Méthodes de paiement',
            paymentMethodManagement: 'Gestion des méthodes de paiement',
            addPaymentMethod: 'Ajouter une méthode',
            editPaymentMethod: 'Modifier la méthode',
            paymentMethod: 'Méthode de paiement',
            paymentMethodName: 'Nom de la méthode',
            productsLinkedCount: 'Produits liés',
            
            // Messages méthodes de prix
            paymentMethodCreated: 'Méthode de paiement créée avec succès',
            paymentMethodUpdated: 'Méthode de paiement mise à jour avec succès',
            paymentMethodDeleted: 'Méthode de paiement supprimée avec succès',
            paymentMethodCreatedSuccess: 'Méthode "{{name}}" créée avec succès !',
            paymentMethodUpdatedSuccess: 'Méthode "{{name}}" mise à jour avec succès !',
            paymentMethodDeletedSuccess: 'Méthode "{{name}}" supprimée avec succès !',
            
            // Confirmations
            confirmDeletePaymentMethod: 'Supprimer la méthode de paiement',
            confirmDeletePaymentMethodMessage: 'Êtes-vous sûr de vouloir supprimer la méthode "{{name}}" ? Cette action est irréversible.',
            
            // Erreurs
            errorCreatingPaymentMethod: 'Erreur lors de la création de la méthode',
            errorUpdatingPaymentMethod: 'Erreur lors de la mise à jour de la méthode',
            errorDeletingPaymentMethod: 'Erreur lors de la suppression',
            
            // Validation
            paymentMethodNameRequired: 'Le nom de la méthode est obligatoire',
            paymentMethodNameMax: 'Le nom ne doit pas dépasser 100 caractères',
            paymentMethodNameUnique: 'Ce nom de méthode existe déjà',
            
            // Statuts
            noPaymentMethodsFound: 'Aucune méthode de paiement trouvée',
            
            // Messages d'interdiction de suppression
            cannotDeletePaymentMethodWithProducts: 'Impossible de supprimer la méthode "{{name}}" car elle est liée à {{count}} produit(s). Vous devez d\'abord supprimer ou modifier ces produits.',
            cannotDeletePaymentMethodWithOrders: 'Impossible de supprimer la méthode "{{name}}" car elle est utilisée par {{count}} commande(s). Vous devez d\'abord modifier ces commandes.',
            cannotDeletePaymentMethodWithProductsAndOrders: 'Impossible de supprimer la méthode "{{name}}" car elle est liée à {{products}} produit(s) et {{orders}} commande(s). Vous devez d\'abord les modifier.',
            ordersCount: 'Commandes',
            
            // Messages de confirmation pour méthodes avec produits
            confirmDeletePaymentMethodWithProducts: 'Attention : Suppression avec produits associés',
            deletePaymentMethodWithProductsMessage: 'Cette méthode de paiement contient {{count}} prix de produit(s). Si vous continuez, la méthode sera supprimée et tous les prix associés seront également supprimés.',
            
            // Client - Sélection méthode de paiement
            selectPaymentMethod: 'Choisir méthode de paiement',
            welcomeToStore: 'Bienvenue dans votre boutique en ligne',
            selectPaymentMethodDesc: 'Sélectionnez votre méthode de paiement pour voir les prix correspondants',
            choosePaymentMethod: 'Choisissez votre méthode de paiement',
            paymentMethodAvailable: 'Méthode disponible',
            selectMethod: 'Choisir',
            loadingProducts: 'Chargement des produits...',
            paymentMethodSelected: 'Méthode {{method}} sélectionnée',
            securePaymentGuaranteed: 'Paiement sécurisé garanti',



                        // Produits
            productManagement: 'Gestion des produits',
            addProduct: 'Ajouter un produit',
            editProduct: 'Modifier le produit',
            viewProduct: 'Voir le produit',
            product: 'Produit',
            productLabel: 'Nom du produit',
            productDescription: 'Description',
            productImage: 'Image',
            productQuantity: 'Quantité',
            productUnit: 'Unité',
            productCurrency: 'Devise',
            productType: 'Type de produit',
            productPrices: 'Prix par méthode',
            socialMediaContact: 'Contact réseaux sociaux',
            
            // Champs contact
            instagramPage: 'Page Instagram',
            facebookPage: 'Page Facebook',
            whatsappNumber: 'Numéro WhatsApp',
            tiktokPage: 'Page TikTok',
            
            // Prix
            price: 'Prix',
            priceFor: 'Prix pour',
            setPrice: 'Définir le prix',
            pricesConfiguration: 'Configuration des prix',
            
            // Messages produits
            productCreated: 'Produit créé avec succès',
            productUpdated: 'Produit mis à jour avec succès',
            productDeleted: 'Produit supprimé avec succès',
            productCreatedSuccess: 'Produit "{{name}}" créé avec succès !',
            productUpdatedSuccess: 'Produit "{{name}}" mis à jour avec succès !',
            productDeletedSuccess: 'Produit "{{name}}" supprimé avec succès !',
            
            // Confirmations
            confirmDeleteProduct: 'Supprimer le produit',
            confirmDeleteProductMessage: 'Êtes-vous sûr de vouloir supprimer le produit "{{name}}" ? Cette action est irréversible.',
            
            // Erreurs
            errorCreatingProduct: 'Erreur lors de la création du produit',
            errorUpdatingProduct: 'Erreur lors de la mise à jour du produit',
            errorDeletingProduct: 'Erreur lors de la suppression',
            
            // Validation
            productLabelRequired: 'Le nom du produit est obligatoire',
            productLabelMax: 'Le nom ne doit pas dépasser 100 caractères',
            productDescriptionMax: 'La description ne doit pas dépasser 1000 caractères',
            productQuantityRequired: 'La quantité est obligatoire',
            productQuantityMin: 'La quantité doit être positive',
            productUnitRequired: 'L\'unité est obligatoire',
            productTypeRequired: 'Le type de produit est obligatoire',
            priceRequired: 'Le prix est obligatoire',
            priceMin: 'Le prix doit être positif',
            imageMaxSize: 'L\'image ne doit pas dépasser 2MB',
            
            // Statuts et filtres
            noProductsFound: 'Aucun produit trouvé',
            allTypes: 'Tous les types',
            optional: 'Optionnel',
            required: 'Obligatoire',
            
            // Informations supplémentaires
            productInfo: 'Informations du produit',
            priceInfo: 'Informations des prix',
            contactInfo: 'Informations de contact',
            imageUpload: 'Télécharger une image',
            currentImage: 'Image actuelle',
            noImage: 'Aucune image',
            changeImage: 'Changer l\'image',
            removeImage: 'Supprimer l\'image',
            
            // Show.jsx - Textes manquants
            modifiedDate: 'Modifié le',
            noPriceConfigured: 'Aucun prix configuré pour ce produit',
            noContactConfigured: 'Aucune information de contact configurée',
            contactAvailable: 'Contact disponible',
            statistics: 'Statistiques',
            pricesConfigured: 'Prix configurés',
            minPrice: 'Min',
            maxPrice: 'Max',
            priceRange: 'Fourchette de prix',
            stock: 'Stock',
            yes: 'Oui',
            no: 'Non',
            backToList: 'Retour à la liste',
            
            // Create/Edit.jsx - Textes manquants
            selectType: 'Sélectionner un type',
            contactNote: 'Ces informations seront affichées aux clients pour les contacter concernant ce produit.',
            fileSizeLimit: 'PNG, JPG, GIF jusqu\'à 2MB',
            
            // Sidebar Admin
            expandSidebar: 'Étendre la sidebar',
            collapseSidebar: 'Réduire la sidebar',
            
            // Placeholder de recherche utilisateurs
            searchUserPlaceholder: 'Rechercher par nom, email ou téléphone...',
            
            // Edit User - Label mot de passe
            newPasswordOptional: 'Nouveau mot de passe (optionnel)',
            leaveBlankToKeep: 'Laisser vide pour ne pas changer',
            leaveBlankIfNoChange: 'Laissez vide si vous ne souhaitez pas changer le mot de passe',
            passwordStrength: 'Force du mot de passe :',
            atLeast8Chars: 'Au moins 8 caractères',
            oneUppercase: 'Une lettre majuscule',
            oneLowercase: 'Une lettre minuscule',
            oneDigit: 'Un chiffre',
            oneSpecialChar: 'Un caractère spécial (!@#$%^&*)',
            
            // Type produit - Suppression avec relations
            confirmDeleteWithProducts: 'Attention : Suppression avec produits associés',
            deleteTypeWithProductsMessage: 'Ce type de produit contient {{count}} produit(s). Si vous continuez, le type sera supprimé et les produits n\'auront plus de type assigné (les produits ne seront pas supprimés).',
            confirmDeleteAll: 'Oui, supprimer le type',
            continueDelete: 'Continuer la suppression',
            
            // Date de modification
            modificationDate: 'Date de modification',

            // Commandes - Admin
            management: 'Gestion',
            ordersFound: 'commande(s) trouvée(s)',
            totalOrders: 'Total des commandes',
            pendingOrders: 'Commandes en attente',
            confirmedOrders: 'Commandes confirmées',
            cancelledOrders: 'Commandes annulées',
            totalRevenue: 'Revenus totaux',
            pending: 'En attente',
            confirmed: 'Confirmée',
            cancelled: 'Annulée',
            filters: 'Filtres',
            searchByUserNameOrEmail: 'Nom d\'utilisateur ou email...',
            allStatuses: 'Tous les statuts',
            dateRange: 'Plage de dates',
            from: 'Du',
            to: 'Au',
            applyFilters: 'Appliquer les filtres',
            resetFilters: 'Réinitialiser',
            noOrdersFound: 'Aucune commande trouvée',
            tryModifyingFilters: 'Essayez de modifier vos filtres pour voir plus de commandes.',
            order: 'Commande',
            customer: 'Client',
            date: 'Date',
            total: 'Total',
            view: 'Voir',
            showing: 'Affichage de',
            of: 'sur',
            results: 'résultats',
            orderNumber: 'Numéro de commande',
            orderInformation: 'Informations de la commande',
            orderDate: 'Date de commande',
            confirmationDate: 'Date de confirmation',
            totalAmount: 'Montant total',
            orderedProducts: 'Produits commandés',
            customerInformation: 'Informations client',
            customerNotes: 'Notes du client',
            adminNotes: 'Notes admin',
            noAdminNotes: 'Aucune note admin',
            addAdminNotes: 'Ajouter des notes admin...',
            noProductsInOrder: 'Aucun produit dans cette commande',
            confirm: 'Confirmer',
            confirmOrderConfirmation: 'Êtes-vous sûr de vouloir confirmer cette commande ?',
            confirmOrderCancellation: 'Êtes-vous sûr de vouloir annuler cette commande ?',
            orderDetails: 'Détails de la commande',
            manageAllOrders: 'Gérer toutes les commandes',
            orderConfirmedSuccess: 'Commande confirmée avec succès',
            orderCancelledSuccess: 'Commande annulée avec succès',
            errorConfirmingOrder: 'Erreur lors de la confirmation de la commande',
            errorCancellingOrder: 'Erreur lors de l\'annulation de la commande',

            // Composants Client - Général
            cart: 'Panier',
            cartIsEmpty: 'Votre panier est vide',
            cartEmptyDescription: 'Ajoutez des produits pour commencer vos achats',
            continueShopping: 'Continuer les achats',
            cartUpdated: 'Panier mis à jour',
            productRemovedFromCart: 'Produit retiré du panier',
            clearCart: 'Vider le panier',
            confirmClearCart: 'Êtes-vous sûr de vouloir vider votre panier ?',
            cartCleared: 'Panier vidé',
            pleaseSelectPaymentMethod: 'Veuillez sélectionner une méthode de paiement',
            orderSummary: 'Résumé de commande',
            itemsCount: '{{count}} article(s)',
            proceedToCheckout: 'Passer à la commande',
            loading: 'Chargement...',

            // Composant Checkout
            checkout: 'Commande',
            finalizingOrder: 'Finaliser ma commande',
            contactInformation: 'Informations de contact',
            facebookPageOptional: 'Page Facebook (optionnel)',
            instagramOptional: 'Instagram (optionnel)',
            additionalNotes: 'Notes additionnelles',
            specialInstructions: 'Instructions spéciales, préférences de livraison, etc.',
            importantInformation: 'Information importante',
            pleaseProvideContact: 'Veuillez fournir au moins un moyen de contact (Facebook ou Instagram) ou des notes pour que nous puissions vous contacter concernant votre commande.',
            continue: 'Continuer',
            verifyOrder: 'Vérifiez votre commande',
            checkYourOrder: 'Vérifiez votre commande',
            orderedProducts: 'Produits commandés',
            quantity: 'Quantité',
            back: 'Retour',
            finalizeOrder: 'Finaliser la commande',
            readyToOrder: 'Prêt à commander',
            orderWillBeProcessed: 'Votre commande sera traitée dès que vous cliquerez sur "Passer la commande". Vous recevrez une confirmation et nous vous contacterons via les moyens fournis.',
            processing: 'Traitement...',
            placeOrder: 'Passer la commande',
            paymentMethodText: 'Méthode de paiement',
            yourCartIsEmpty: 'Votre panier est vide',
            orderCreationError: 'Erreur lors de la création de la commande',

            // Composant Catalogue
            catalog: 'Catalogue',
            searchProducts: 'Rechercher des produits...',
            priceRange: 'Gamme de prix',
            applyFilters: 'Appliquer les filtres',
            clearFilters: 'Effacer les filtres',
            noProductsFound: 'Aucun produit trouvé',
            tryDifferentFilters: 'Essayez des filtres différents pour voir plus de produits',
            addToCart: 'Ajouter au panier',
            viewDetails: 'Voir les détails',
            productAddedToCart: 'Produit ajouté au panier',
            pleaseSelectPaymentMethodFirst: 'Veuillez sélectionner une méthode de paiement',
            errorAddingToCart: 'Erreur lors de l\'ajout au panier',
            productInfo: 'Info produit',
            contactVendor: 'Contacter le vendeur',

            // Composant Détails Produit
            productDetails: 'Détails du produit',
            productDescription: 'Description',
            noDescriptionAvailable: 'Aucune description disponible',
            contactInformationVendor: 'Informations de contact',
            noContactAvailable: 'Aucune information de contact disponible',
            specifications: 'Spécifications',
            pricePerUnit: 'Prix par unité',
            availableQuantity: 'Quantité disponible',
            currency: 'Devise',

            // Composant Succès Commande
            orderSuccess: 'Commande confirmée',
            orderPlacedSuccessfully: 'Votre commande a été passée avec succès !',
            orderNumber: 'Numéro de commande',
            thankYou: 'Merci pour votre commande',
            willContactSoon: 'Nous vous contacterons bientôt pour confirmer les détails.',
            orderSummary: 'Résumé de commande',
            backToProducts: 'Retour aux produits',
            viewOrderHistory: 'Voir l\'historique des commandes',

            // Composant Historique Commandes
            orderHistory: 'Historique des commandes',
            myOrders: 'Mes commandes',
            noOrdersYet: 'Aucune commande encore',
            startShoppingDescription: 'Vous n\'avez encore passé aucune commande. Commencez vos achats !',
            status: 'Statut',
            viewOrder: 'Voir la commande',

            // Composant Sélection Méthode Paiement
            selectPaymentMethod: 'Choisir la méthode de paiement',
            welcomeToStore: 'Bienvenue dans votre boutique en ligne',
            selectPaymentMethodDesc: 'Sélectionnez votre méthode de paiement pour voir les prix correspondants',
            choosePaymentMethod: 'Choisissez votre méthode de paiement',
            paymentMethodAvailable: 'Méthode disponible',
            selectMethod: 'Choisir',
            loadingProducts: 'Chargement des produits...',
            paymentMethodSelected: 'Méthode {{method}} sélectionnée',
            securePaymentGuaranteed: 'Paiement sécurisé garanti',
            
            // Messages informatifs
            methodsAvailableForAllProducts: 'Seules les méthodes disponibles pour tous les produits sont affichées',
            noMethodsAvailable: 'Aucune méthode de paiement disponible pour tous les produits',
            contactAdminForPaymentMethods: 'Veuillez contacter l\'administrateur pour configurer les méthodes de paiement.',

        }
    },
    ar: {
        translation: {
            // Navigation
            dashboard: 'لوحة القيادة',
            users: 'المستخدمون',
            products: 'المنتجات',
            orders: 'الطلبات',
            home: 'الرئيسية',
            
            // Gestion utilisateurs
            userManagement: 'إدارة المستخدمين',
            addUser: 'إضافة مستخدم',
            editUser: 'تعديل المستخدم',
            name: 'الاسم',
            email: 'البريد الإلكتروني',
            phone: 'الهاتف',
            role: 'الدور',
            password: 'كلمة المرور',
            confirmPassword: 'تأكيد كلمة المرور',
            admin: 'مدير',
            client: 'عميل',
            status: 'الحالة',
            active: 'نشط',
            blocked: 'محظور',
            block: 'حظر',
            unblock: 'إلغاء الحظر',
            
            // Actions
            add: 'إضافة',
            edit: 'تعديل',
            delete: 'حذف',
            save: 'حفظ',
            cancel: 'إلغاء',
            search: 'بحث',
            
            // Messages
            userCreated: 'تم إنشاء المستخدم بنجاح',
            userUpdated: 'تم تحديث المستخدم بنجاح',
            userDeleted: 'تم حذف المستخدم بنجاح',
            userBlocked: 'تم حظر المستخدم بنجاح',
            userUnblocked: 'تم إلغاء حظر المستخدم بنجاح',
            
            // Toasts et confirmations
            confirmDelete: 'حذف المستخدم',
            confirmDeleteMessage: 'هل أنت متأكد من أنك تريد حذف المستخدم "{{name}}" نهائياً؟ هذا الإجراء لا يمكن التراجع عنه.',
            confirmBlock: 'حظر المستخدم',
            confirmUnblock: 'إلغاء حظر المستخدم',
            confirmBlockMessage: 'هل أنت متأكد من أنك تريد حظر المستخدم "{{name}}"؟',
            confirmUnblockMessage: 'هل أنت متأكد من أنك تريد إلغاء حظر المستخدم "{{name}}"؟',
            
            // Messages de loading
            creating: 'جاري إنشاء المستخدم...',
            updating: 'جاري تحديث المستخدم...',
            deleting: 'جاري الحذف...',
            blocking: 'جاري الحظر...',
            unblocking: 'جاري إلغاء الحظر...',
            
            // Messages d'erreur
            errorCreating: 'خطأ أثناء إنشاء المستخدم',
            errorUpdating: 'خطأ أثناء تحديث المستخدم',
            errorDeleting: 'خطأ أثناء الحذف',
            errorBlocking: 'خطأ أثناء الحظر',
            errorUnblocking: 'خطأ أثناء إلغاء الحظر',
            
            // Messages de succès détaillés
            userCreatedSuccess: 'تم إنشاء المستخدم "{{name}}" بنجاح!',
            userUpdatedSuccess: 'تم تحديث المستخدم "{{name}}" بنجاح!',
            userDeletedSuccess: 'تم حذف المستخدم "{{name}}" بنجاح!',
            userBlockedSuccess: 'تم حظر المستخدم "{{name}}" بنجاح!',
            userUnblockedSuccess: 'تم إلغاء حظر المستخدم "{{name}}" بنجاح!',
            
            // Pagination et filtres
            allRoles: 'جميع الأدوار',
            noUsersFound: 'لم يتم العثور على مستخدمين',
            actions: 'الإجراءات',
            previous: 'السابق',
            next: 'التالي',
            showingResults: 'عرض {{from}} إلى {{to}} من أصل {{total}} نتيجة',
            
            // Profil et authentification
            profile: 'الملف الشخصي',
            logout: 'تسجيل الخروج',
            updateProfile: 'تحديث الملف الشخصي',
            profileInformation: 'معلومات الملف الشخصي',
            updatePassword: 'تحديث كلمة المرور',
            deleteAccount: 'حذف الحساب',
            currentPassword: 'كلمة المرور الحالية',
            newPassword: 'كلمة المرور الجديدة',
            confirmNewPassword: 'تأكيد كلمة المرور الجديدة',
            updateProfileDescription: 'قم بتحديث معلومات الملف الشخصي وعنوان البريد الإلكتروني لحسابك.',
            updatePasswordDescription: 'تأكد من أن حسابك يستخدم كلمة مرور طويلة وعشوائية للبقاء آمناً.',
            deleteAccountDescription: 'بمجرد حذف حسابك، سيتم حذف جميع موارده وبياناته نهائياً.',


             // Types de produits
            productTypes: 'أنواع المنتجات',
            productTypeManagement: 'إدارة أنواع المنتجات',
            addProductType: 'إضافة نوع',
            editProductType: 'تعديل النوع',
            productTypeName: 'اسم النوع',
            productsCount: 'عدد المنتجات',
            
            // Messages types produits
            productTypeCreated: 'تم إنشاء نوع المنتج بنجاح',
            productTypeUpdated: 'تم تحديث نوع المنتج بنجاح',
            productTypeDeleted: 'تم حذف نوع المنتج بنجاح',
            productTypeCreatedSuccess: 'تم إنشاء النوع "{{name}}" بنجاح!',
            productTypeUpdatedSuccess: 'تم تحديث النوع "{{name}}" بنجاح!',
            productTypeDeletedSuccess: 'تم حذف النوع "{{name}}" بنجاح!',
            
            // Confirmations
            confirmDeleteProductType: 'حذف نوع المنتج',
            confirmDeleteProductTypeMessage: 'هل أنت متأكد من أنك تريد حذف النوع "{{name}}"؟ هذا الإجراء لا يمكن التراجع عنه.',
            
            // Erreurs
            errorCreatingProductType: 'خطأ أثناء إنشاء النوع',
            errorUpdatingProductType: 'خطأ أثناء تحديث النوع',
            errorDeletingProductType: 'خطأ أثناء الحذف',
            
            // Validation
            productTypeNameRequired: 'اسم النوع مطلوب',
            productTypeNameMax: 'الاسم يجب ألا يتجاوز 100 حرف',
            productTypeNameUnique: 'هذا الاسم موجود بالفعل',
            
            // Statuts
            noProductTypesFound: 'لم يتم العثور على أنواع منتجات',
            creationDate: 'تاريخ الإنشاء',

                        // Méthodes de prix
            paymentMethods: 'طرق الدفع',
            paymentMethodManagement: 'إدارة طرق الدفع',
            addPaymentMethod: 'إضافة طريقة',
            editPaymentMethod: 'تعديل الطريقة',
            paymentMethod: 'طريقة الدفع',
            paymentMethodName: 'اسم طريقة الدفع',
            productsLinkedCount: 'المنتجات المربوطة',
            
            // Messages méthodes de prix
            paymentMethodCreated: 'تم إنشاء طريقة الدفع بنجاح',
            paymentMethodUpdated: 'تم تحديث طريقة الدفع بنجاح',
            paymentMethodDeleted: 'تم حذف طريقة الدفع بنجاح',
            paymentMethodCreatedSuccess: 'تم إنشاء الطريقة "{{name}}" بنجاح!',
            paymentMethodUpdatedSuccess: 'تم تحديث الطريقة "{{name}}" بنجاح!',
            paymentMethodDeletedSuccess: 'تم حذف الطريقة "{{name}}" بنجاح!',
            
            // Confirmations
            confirmDeletePaymentMethod: 'حذف طريقة الدفع',
            confirmDeletePaymentMethodMessage: 'هل أنت متأكد من أنك تريد حذف الطريقة "{{name}}"؟ هذا الإجراء لا يمكن التراجع عنه.',
            
            // Erreurs
            errorCreatingPaymentMethod: 'خطأ أثناء إنشاء طريقة الدفع',
            errorUpdatingPaymentMethod: 'خطأ أثناء تحديث طريقة الدفع',
            errorDeletingPaymentMethod: 'خطأ أثناء الحذف',
            
            // Validation
            paymentMethodNameRequired: 'اسم طريقة الدفع مطلوب',
            paymentMethodNameMax: 'الاسم يجب ألا يتجاوز 100 حرف',
            paymentMethodNameUnique: 'هذا الاسم موجود بالفعل',
            
            // Statuts
            noPaymentMethodsFound: 'لم يتم العثور على طرق دفع',
            
            // Messages d'interdiction de suppression
            cannotDeletePaymentMethodWithProducts: 'لا يمكن حذف الطريقة "{{name}}" لأنها مرتبطة بـ {{count}} منتج/منتجات. يجب أولاً حذف أو تعديل هذه المنتجات.',
            cannotDeletePaymentMethodWithOrders: 'لا يمكن حذف الطريقة "{{name}}" لأنها مستخدمة من قبل {{count}} طلب/طلبات. يجب أولاً تعديل هذه الطلبات.',
            cannotDeletePaymentMethodWithProductsAndOrders: 'لا يمكن حذف الطريقة "{{name}}" لأنها مرتبطة بـ {{products}} منتج/منتجات و {{orders}} طلب/طلبات. يجب أولاً تعديلها.',
            ordersCount: 'الطلبات',
            
            // Messages de confirmation pour méthodes avec produits
            confirmDeletePaymentMethodWithProducts: 'تحذير: حذف مع المنتجات المرتبطة',
            deletePaymentMethodWithProductsMessage: 'تحتوي طريقة الدفع هذه على {{count}} سعر منتج/منتجات. إذا واصلت، سيتم حذف الطريقة وجميع الأسعار المرتبطة أيضاً.',
            
            // Client - Sélection méthode de paiement
            selectPaymentMethod: 'اختر طريقة الدفع',
            welcomeToStore: 'مرحباً بك في متجرك الإلكتروني',
            selectPaymentMethodDesc: 'اختر طريقة الدفع المفضلة لديك لرؤية الأسعار المقابلة',
            choosePaymentMethod: 'اختر طريقة الدفع',
            paymentMethodAvailable: 'طريقة متاحة',
            selectMethod: 'اختيار',
            loadingProducts: 'جاري تحميل المنتجات...',
            paymentMethodSelected: 'تم اختيار طريقة {{method}}',
            securePaymentGuaranteed: 'دفع آمن مضمون',



            // Produits
            productManagement: 'إدارة المنتجات',
            addProduct: 'إضافة منتج',
            editProduct: 'تعديل المنتج',
            viewProduct: 'عرض المنتج',
            product: 'المنتج',
            productLabel: 'اسم المنتج',
            productDescription: 'الوصف',
            productImage: 'الصورة',
            productQuantity: 'الكمية',
            productUnit: 'الوحدة',
            productCurrency: 'العملة',
            productType: 'نوع المنتج',
            productPrices: 'الأسعار حسب الطريقة',
            socialMediaContact: 'التواصل عبر مواقع التواصل',
            
            // Champs contact
            instagramPage: 'صفحة انستغرام',
            facebookPage: 'صفحة فيسبوك',
            whatsappNumber: 'رقم واتساب',
            tiktokPage: 'صفحة تيك توك',
            
            // Prix
            price: 'السعر',
            priceFor: 'السعر لـ',
            setPrice: 'تحديد السعر',
            pricesConfiguration: 'تكوين الأسعار',
            
            // Messages produits
            productCreated: 'تم إنشاء المنتج بنجاح',
            productUpdated: 'تم تحديث المنتج بنجاح',
            productDeleted: 'تم حذف المنتج بنجاح',
            productCreatedSuccess: 'تم إنشاء المنتج "{{name}}" بنجاح!',
            productUpdatedSuccess: 'تم تحديث المنتج "{{name}}" بنجاح!',
            productDeletedSuccess: 'تم حذف المنتج "{{name}}" بنجاح!',
            
            // Confirmations
            confirmDeleteProduct: 'حذف المنتج',
            confirmDeleteProductMessage: 'هل أنت متأكد من أنك تريد حذف المنتج "{{name}}"؟ هذا الإجراء لا يمكن التراجع عنه.',
            
            // Erreurs
            errorCreatingProduct: 'خطأ أثناء إنشاء المنتج',
            errorUpdatingProduct: 'خطأ أثناء تحديث المنتج',
            errorDeletingProduct: 'خطأ أثناء الحذف',
            
            // Validation
            productLabelRequired: 'اسم المنتج مطلوب',
            productLabelMax: 'الاسم يجب ألا يتجاوز 100 حرف',
            productDescriptionMax: 'الوصف يجب ألا يتجاوز 1000 حرف',
            productQuantityRequired: 'الكمية مطلوبة',
            productQuantityMin: 'الكمية يجب أن تكون موجبة',
            productUnitRequired: 'الوحدة مطلوبة',
            productTypeRequired: 'نوع المنتج مطلوب',
            priceRequired: 'السعر مطلوب',
            priceMin: 'السعر يجب أن يكون موجب',
            imageMaxSize: 'الصورة يجب ألا تتجاوز 2 ميجا',
            
            // Statuts et filtres
            noProductsFound: 'لم يتم العثور على منتجات',
            allTypes: 'جميع الأنواع',
            optional: 'اختياري',
            required: 'مطلوب',
            
            // Informations supplémentaires
            productInfo: 'معلومات المنتج',
            priceInfo: 'معلومات الأسعار',
            contactInfo: 'معلومات التواصل',
            imageUpload: 'تحميل صورة',
            currentImage: 'الصورة الحالية',
            noImage: 'لا توجد صورة',
            changeImage: 'تغيير الصورة',
            removeImage: 'حذف الصورة',
            
            // Show.jsx - Textes manquants
            modifiedDate: 'تاريخ التعديل',
            noPriceConfigured: 'لم يتم تكوين أسعار لهذا المنتج',
            noContactConfigured: 'لم يتم تكوين معلومات الاتصال',
            contactAvailable: 'الاتصال متاح',
            statistics: 'الإحصائيات',
            pricesConfigured: 'الأسعار المكونة',
            minPrice: 'الأدنى',
            maxPrice: 'الأعلى',
            priceRange: 'نطاق السعر',
            stock: 'المخزون',
            yes: 'نعم',
            no: 'لا',
            backToList: 'العودة إلى القائمة',
            
            // Create/Edit.jsx - Textes manquants
            selectType: 'اختر نوع',
            contactNote: 'ستظهر هذه المعلومات للعملاء للاتصال بخصوص هذا المنتج.',
            fileSizeLimit: 'PNG، JPG، GIF حتى 2 ميجا',
            
            // Sidebar Admin
            expandSidebar: 'توسيع الشريط الجانبي',
            collapseSidebar: 'طي الشريط الجانبي',
            
            // Placeholder de recherche utilisateurs
            searchUserPlaceholder: 'البحث بالاسم أو البريد الإلكتروني أو الهاتف...',
            
            // Edit User - Label mot de passe
            newPasswordOptional: '(اختياري) كلمة المرور الجديدة',
            leaveBlankToKeep: 'اتركه فارغاً لعدم التغيير',
            leaveBlankIfNoChange: 'اتركه فارغاً إذا كنت لا تريد تغيير كلمة المرور',
            passwordStrength: 'قوة كلمة المرور:',
            atLeast8Chars: 'على الأقل 8 أحرف',
            oneUppercase: 'حرف كبير واحد',
            oneLowercase: 'حرف صغير واحد',
            oneDigit: 'رقم واحد',
            oneSpecialChar: 'رمز خاص واحد (!@#$%^&*)',
            
            // Type produit - Suppression avec relations
            confirmDeleteWithProducts: 'تحذير: حذف مع المنتجات المرتبطة',
            deleteTypeWithProductsMessage: 'يحتوي هذا النوع على {{count}} منتج/منتجات. إذا واصلت، سيتم حذف النوع وستصبح المنتجات بدون نوع محدد (المنتجات لن يتم حذفها).',
            confirmDeleteAll: 'نعم، احذف النوع',
            continueDelete: 'متابعة الحذف',
            
            // Date de modification
            modificationDate: 'تاريخ التعديل',

            // Commandes - Admin
            management: 'الإدارة',
            ordersFound: 'طلب/طلبات موجودة',
            totalOrders: 'إجمالي الطلبات',
            pendingOrders: 'الطلبات قيد الانتظار',
            confirmedOrders: 'الطلبات المؤكدة',
            cancelledOrders: 'الطلبات المُلغاة',
            totalRevenue: 'إجمالي الإيرادات',
            pending: 'قيد الانتظار',
            confirmed: 'مؤكد',
            cancelled: 'مُلغى',
            filters: 'المرشحات',
            searchByUserNameOrEmail: 'اسم المستخدم أو البريد الإلكتروني...',
            allStatuses: 'جميع الحالات',
            dateRange: 'نطاق التاريخ',
            from: 'من',
            to: 'إلى',
            applyFilters: 'تطبيق المرشحات',
            resetFilters: 'إعادة تعيين',
            noOrdersFound: 'لم يتم العثور على طلبات',
            tryModifyingFilters: 'جرب تعديل المرشحات لرؤية المزيد من الطلبات.',
            order: 'الطلب',
            customer: 'العميل',
            date: 'التاريخ',
            total: 'المجموع',
            view: 'عرض',
            showing: 'عرض من',
            of: 'من أصل',
            results: 'نتيجة',
            orderNumber: 'رقم الطلب',
            orderInformation: 'معلومات الطلب',
            orderDate: 'تاريخ الطلب',
            confirmationDate: 'تاريخ التأكيد',
            totalAmount: 'المبلغ الإجمالي',
            orderedProducts: 'المنتجات المطلوبة',
            customerInformation: 'معلومات العميل',
            customerNotes: 'ملاحظات العميل',
            adminNotes: 'ملاحظات المدير',
            noAdminNotes: 'لا توجد ملاحظات للمدير',
            addAdminNotes: 'إضافة ملاحظات المدير...',
            noProductsInOrder: 'لا توجد منتجات في هذا الطلب',
            confirm: 'تأكيد',
            confirmOrderConfirmation: 'هل أنت متأكد من تأكيد هذا الطلب؟',
            confirmOrderCancellation: 'هل أنت متأكد من إلغاء هذا الطلب؟',
            orderDetails: 'تفاصيل الطلب',
            manageAllOrders: 'إدارة جميع الطلبات',
            orderConfirmedSuccess: 'تم تأكيد الطلب بنجاح',
            orderCancelledSuccess: 'تم إلغاء الطلب بنجاح',
            errorConfirmingOrder: 'خطأ أثناء تأكيد الطلب',
            errorCancellingOrder: 'خطأ أثناء إلغاء الطلب',

            // مكونات العميل - عام
            cart: 'السلة',
            cartIsEmpty: 'سلتك فارغة',
            cartEmptyDescription: 'أضف منتجات لبدء التسوق',
            continueShopping: 'متابعة التسوق',
            cartUpdated: 'تم تحديث السلة',
            productRemovedFromCart: 'تم إزالة المنتج من السلة',
            clearCart: 'إفراغ السلة',
            confirmClearCart: 'هل أنت متأكد من إفراغ السلة؟',
            cartCleared: 'تم إفراغ السلة',
            pleaseSelectPaymentMethod: 'يرجى اختيار طريقة دفع',
            orderSummary: 'ملخص الطلب',
            itemsCount: '{{count}} عنصر/عناصر',
            proceedToCheckout: 'متابعة للدفع',
            loading: 'جاري التحميل...',

            // مكون الدفع
            checkout: 'الدفع',
            finalizingOrder: 'إنهاء طلبي',
            contactInformation: 'معلومات الاتصال',
            facebookPageOptional: 'صفحة فيسبوك (اختياري)',
            instagramOptional: 'إنستغرام (اختياري)',
            additionalNotes: 'ملاحظات إضافية',
            specialInstructions: 'تعليمات خاصة، تفضيلات التسليم، إلخ.',
            importantInformation: 'معلومات مهمة',
            pleaseProvideContact: 'يرجى تقديم وسيلة اتصال واحدة على الأقل (فيسبوك أو إنستغرام) أو ملاحظات حتى نتمكن من التواصل معك بشأن طلبك.',
            continue: 'متابعة',
            verifyOrder: 'تحقق من طلبك',
            checkYourOrder: 'تحقق من طلبك',
            orderedProducts: 'المنتجات المطلوبة',
            quantity: 'الكمية',
            back: 'رجوع',
            finalizeOrder: 'إنهاء الطلب',
            readyToOrder: 'جاهز للطلب',
            orderWillBeProcessed: 'سيتم معالجة طلبك بمجرد النقر على "تقديم الطلب". ستتلقى تأكيدًا وسنتواصل معك عبر الوسائل المقدمة.',
            processing: 'جاري المعالجة...',
            placeOrder: 'تقديم الطلب',
            paymentMethodText: 'طريقة الدفع',
            yourCartIsEmpty: 'سلتك فارغة',
            orderCreationError: 'خطأ في إنشاء الطلب',

            // مكون الكتالوج
            catalog: 'الكتالوج',
            searchProducts: 'البحث عن منتجات...',
            priceRange: 'نطاق السعر',
            applyFilters: 'تطبيق الفلاتر',
            clearFilters: 'مسح الفلاتر',
            noProductsFound: 'لم يتم العثور على منتجات',
            tryDifferentFilters: 'جرب فلاتر مختلفة لرؤية المزيد من المنتجات',
            addToCart: 'إضافة للسلة',
            viewDetails: 'عرض التفاصيل',
            productAddedToCart: 'تم إضافة المنتج للسلة',
            pleaseSelectPaymentMethodFirst: 'يرجى اختيار طريقة دفع',
            errorAddingToCart: 'خطأ في إضافة للسلة',
            productInfo: 'معلومات المنتج',
            contactVendor: 'اتصل بالبائع',

            // مكون تفاصيل المنتج
            productDetails: 'تفاصيل المنتج',
            productDescription: 'الوصف',
            noDescriptionAvailable: 'لا يوجد وصف متاح',
            contactInformationVendor: 'معلومات الاتصال',
            noContactAvailable: 'لا تتوفر معلومات اتصال',
            specifications: 'المواصفات',
            pricePerUnit: 'السعر لكل وحدة',
            availableQuantity: 'الكمية المتاحة',
            currency: 'العملة',

            // مكون نجح الطلب
            orderSuccess: 'تم تأكيد الطلب',
            orderPlacedSuccessfully: 'تم تقديم طلبك بنجاح!',
            orderNumber: 'رقم الطلب',
            thankYou: 'شكرًا لك على طلبك',
            willContactSoon: 'سنتواصل معك قريبًا لتأكيد التفاصيل.',
            orderSummary: 'ملخص الطلب',
            backToProducts: 'العودة للمنتجات',
            viewOrderHistory: 'عرض تاريخ الطلبات',

            // مكون تاريخ الطلبات
            orderHistory: 'تاريخ الطلبات',
            myOrders: 'طلباتي',
            noOrdersYet: 'لا توجد طلبات بعد',
            startShoppingDescription: 'لم تقم بأي طلبات بعد. ابدأ التسوق!',
            status: 'الحالة',
            viewOrder: 'عرض الطلب',

            // مكون اختيار طريقة الدفع
            selectPaymentMethod: 'اختر طريقة الدفع',
            welcomeToStore: 'أهلاً بك في متجرك الإلكتروني',
            selectPaymentMethodDesc: 'اختر طريقة الدفع المفضلة لديك لرؤية الأسعار المقابلة',
            choosePaymentMethod: 'اختر طريقة الدفع',
            paymentMethodAvailable: 'الطريقة متاحة',
            selectMethod: 'اختيار',
            loadingProducts: 'جاري تحميل المنتجات...',
            paymentMethodSelected: 'تم اختيار طريقة {{method}}',
            securePaymentGuaranteed: 'دفع آمن مضمون',
            
            // رسائل إعلامية
            methodsAvailableForAllProducts: 'يتم عرض الطرق المتاحة لجميع المنتجات فقط',
            noMethodsAvailable: 'لا توجد طرق دفع متاحة لجميع المنتجات',
            contactAdminForPaymentMethods: 'يرجى الاتصال بالإدارة لتكوين طرق الدفع.',

        }
    },
    en: {
        translation: {
            // Navigation
            dashboard: 'Dashboard',
            users: 'Users',
            products: 'Products',
            orders: 'Orders',
            home: 'Home',
            
            // Gestion utilisateurs
            userManagement: 'User Management',
            addUser: 'Add User',
            editUser: 'Edit User',
            name: 'Name',
            email: 'Email',
            phone: 'Phone',
            role: 'Role',
            password: 'Password',
            confirmPassword: 'Confirm Password',
            admin: 'Administrator',
            client: 'Client',
            status: 'Status',
            active: 'Active',
            blocked: 'Blocked',
            block: 'Block',
            unblock: 'Unblock',
            
            // Actions
            add: 'Add',
            edit: 'Edit',
            delete: 'Delete',
            save: 'Save',
            cancel: 'Cancel',
            search: 'Search',
            
            // Messages
            userCreated: 'User created successfully',
            userUpdated: 'User updated successfully',
            userDeleted: 'User deleted successfully',
            userBlocked: 'User blocked successfully',
            userUnblocked: 'User unblocked successfully',
            
            // Toasts et confirmations
            confirmDelete: 'Delete User',
            confirmDeleteMessage: 'Are you sure you want to permanently delete user "{{name}}"? This action is irreversible.',
            confirmBlock: 'Block User',
            confirmUnblock: 'Unblock User',
            confirmBlockMessage: 'Are you sure you want to block user "{{name}}"?',
            confirmUnblockMessage: 'Are you sure you want to unblock user "{{name}}"?',
            
            // Messages de loading
            creating: 'Creating user...',
            updating: 'Updating user...',
            deleting: 'Deleting...',
            blocking: 'Blocking...',
            unblocking: 'Unblocking...',
            
            // Messages d'erreur
            errorCreating: 'Error creating user',
            errorUpdating: 'Error updating user',
            errorDeleting: 'Error deleting',
            errorBlocking: 'Error blocking',
            errorUnblocking: 'Error unblocking',
            
            // Messages de succès détaillés
            userCreatedSuccess: 'User "{{name}}" created successfully!',
            userUpdatedSuccess: 'User "{{name}}" updated successfully!',
            userDeletedSuccess: 'User "{{name}}" deleted successfully!',
            userBlockedSuccess: 'User "{{name}}" blocked successfully!',
            userUnblockedSuccess: 'User "{{name}}" unblocked successfully!',
            
            // Pagination et filtres
            allRoles: 'All roles',
            noUsersFound: 'No users found',
            actions: 'Actions',
            previous: 'Previous',
            next: 'Next',
            showingResults: 'Showing {{from}} to {{to}} of {{total}} results',
            
            // Profil et authentification
            profile: 'Profile',
            logout: 'Log Out',
            updateProfile: 'Update Profile',
            profileInformation: 'Profile Information',
            updatePassword: 'Update Password',
            deleteAccount: 'Delete Account',
            currentPassword: 'Current Password',
            newPassword: 'New Password',
            confirmNewPassword: 'Confirm New Password',
            updateProfileDescription: 'Update your account\'s profile information and email address.',
            updatePasswordDescription: 'Ensure your account is using a long, random password to stay secure.',
            deleteAccountDescription: 'Once your account is deleted, all of its resources and data will be permanently deleted.',

             // Types de produits
            productTypes: 'Product Types',
            productTypeManagement: 'Product Type Management',
            addProductType: 'Add Type',
            editProductType: 'Edit Type',
            productTypeName: 'Type Name',
            productsCount: 'Products Count',
            
            // Messages types produits
            productTypeCreated: 'Product type created successfully',
            productTypeUpdated: 'Product type updated successfully',
            productTypeDeleted: 'Product type deleted successfully',
            productTypeCreatedSuccess: 'Type "{{name}}" created successfully!',
            productTypeUpdatedSuccess: 'Type "{{name}}" updated successfully!',
            productTypeDeletedSuccess: 'Type "{{name}}" deleted successfully!',
            
            // Confirmations
            confirmDeleteProductType: 'Delete Product Type',
            confirmDeleteProductTypeMessage: 'Are you sure you want to delete type "{{name}}"? This action is irreversible.',
            
            // Erreurs
            errorCreatingProductType: 'Error creating type',
            errorUpdatingProductType: 'Error updating type',
            errorDeletingProductType: 'Error deleting',
            
            // Validation
            productTypeNameRequired: 'Type name is required',
            productTypeNameMax: 'Name must not exceed 100 characters',
            productTypeNameUnique: 'This type name already exists',
            
            // Statuts
            noProductTypesFound: 'No product types found',
            creationDate: 'Creation Date',

            // Méthodes de prix
            paymentMethods: 'Payment Methods',
            paymentMethodManagement: 'Payment Method Management',
            addPaymentMethod: 'Add Method',
            editPaymentMethod: 'Edit Method',
            paymentMethod: 'Payment Method',
            paymentMethodName: 'Method Name',
            productsLinkedCount: 'Linked Products',
            
            // Messages méthodes de prix
            paymentMethodCreated: 'Payment method created successfully',
            paymentMethodUpdated: 'Payment method updated successfully',
            paymentMethodDeleted: 'Payment method deleted successfully',
            paymentMethodCreatedSuccess: 'Method "{{name}}" created successfully!',
            paymentMethodUpdatedSuccess: 'Method "{{name}}" updated successfully!',
            paymentMethodDeletedSuccess: 'Method "{{name}}" deleted successfully!',
            
            // Confirmations
            confirmDeletePaymentMethod: 'Delete Payment Method',
            confirmDeletePaymentMethodMessage: 'Are you sure you want to delete method "{{name}}"? This action is irreversible.',
            
            // Erreurs
            errorCreatingPaymentMethod: 'Error creating payment method',
            errorUpdatingPaymentMethod: 'Error updating payment method',
            errorDeletingPaymentMethod: 'Error deleting',
            
            // Validation
            paymentMethodNameRequired: 'Method name is required',
            paymentMethodNameMax: 'Name must not exceed 100 characters',
            paymentMethodNameUnique: 'This method name already exists',
            
            // Statuts
            noPaymentMethodsFound: 'No payment methods found',
            
            // Messages d'interdiction de suppression
            cannotDeletePaymentMethodWithProducts: 'Cannot delete method "{{name}}" because it is linked to {{count}} product(s). You must first delete or modify these products.',
            cannotDeletePaymentMethodWithOrders: 'Cannot delete method "{{name}}" because it is used by {{count}} order(s). You must first modify these orders.',
            cannotDeletePaymentMethodWithProductsAndOrders: 'Cannot delete method "{{name}}" because it is linked to {{products}} product(s) and {{orders}} order(s). You must first modify them.',
            ordersCount: 'Orders',
            
            // Messages de confirmation pour méthodes avec produits
            confirmDeletePaymentMethodWithProducts: 'Warning: Delete with associated products',
            deletePaymentMethodWithProductsMessage: 'This payment method contains {{count}} product price(s). If you continue, the method will be deleted and all associated prices will also be deleted.',
            
            // Client - Sélection méthode de paiement
            selectPaymentMethod: 'Choose Payment Method',
            welcomeToStore: 'Welcome to your online store',
            selectPaymentMethodDesc: 'Select your preferred payment method to see corresponding prices',
            choosePaymentMethod: 'Choose your payment method',
            paymentMethodAvailable: 'Method available',
            selectMethod: 'Select',
            loadingProducts: 'Loading products...',
            paymentMethodSelected: 'Method {{method}} selected',
            securePaymentGuaranteed: 'Secure payment guaranteed',




              // Produits
            productManagement: 'Product Management',
            addProduct: 'Add Product',
            editProduct: 'Edit Product',
            viewProduct: 'View Product',
            product: 'Product',
            productLabel: 'Product Name',
            productDescription: 'Description',
            productImage: 'Image',
            productQuantity: 'Quantity',
            productUnit: 'Unit',
            productCurrency: 'Currency',
            productType: 'Product Type',
            productPrices: 'Prices by Method',
            socialMediaContact: 'Social Media Contact',
            
            // Champs contact
            instagramPage: 'Instagram Page',
            facebookPage: 'Facebook Page',
            whatsappNumber: 'WhatsApp Number',
            tiktokPage: 'TikTok Page',
            
            // Prix
            price: 'Price',
            priceFor: 'Price for',
            setPrice: 'Set Price',
            pricesConfiguration: 'Prices Configuration',
            
            // Messages produits
            productCreated: 'Product created successfully',
            productUpdated: 'Product updated successfully',
            productDeleted: 'Product deleted successfully',
            productCreatedSuccess: 'Product "{{name}}" created successfully!',
            productUpdatedSuccess: 'Product "{{name}}" updated successfully!',
            productDeletedSuccess: 'Product "{{name}}" deleted successfully!',
            
            // Confirmations
            confirmDeleteProduct: 'Delete Product',
            confirmDeleteProductMessage: 'Are you sure you want to delete product "{{name}}"? This action is irreversible.',
            
            // Erreurs
            errorCreatingProduct: 'Error creating product',
            errorUpdatingProduct: 'Error updating product',
            errorDeletingProduct: 'Error deleting',
            
            // Validation
            productLabelRequired: 'Product name is required',
            productLabelMax: 'Name must not exceed 100 characters',
            productDescriptionMax: 'Description must not exceed 1000 characters',
            productQuantityRequired: 'Quantity is required',
            productQuantityMin: 'Quantity must be positive',
            productUnitRequired: 'Unit is required',
            productTypeRequired: 'Product type is required',
            priceRequired: 'Price is required',
            priceMin: 'Price must be positive',
            imageMaxSize: 'Image must not exceed 2MB',
            
            // Statuts et filtres
            noProductsFound: 'No products found',
            allTypes: 'All types',
            optional: 'Optional',
            required: 'Required',
            
            // Informations supplémentaires
            productInfo: 'Product Information',
            priceInfo: 'Price Information',
            contactInfo: 'Contact Information',
            imageUpload: 'Upload Image',
            currentImage: 'Current Image',
            noImage: 'No Image',
            changeImage: 'Change Image',
            removeImage: 'Remove Image',
            
            // Show.jsx - Textes manquants
            modifiedDate: 'Modified on',
            noPriceConfigured: 'No prices configured for this product',
            noContactConfigured: 'No contact information configured',
            contactAvailable: 'Contact available',
            statistics: 'Statistics',
            pricesConfigured: 'Prices configured',
            minPrice: 'Min',
            maxPrice: 'Max',
            priceRange: 'Price range',
            stock: 'Stock',
            yes: 'Yes',
            no: 'No',
            backToList: 'Back to list',
            
            // Create/Edit.jsx - Textes manquants
            selectType: 'Select a type',
            contactNote: 'This information will be displayed to customers to contact them about this product.',
            fileSizeLimit: 'PNG, JPG, GIF up to 2MB',
            
            // Sidebar Admin
            expandSidebar: 'Expand sidebar',
            collapseSidebar: 'Collapse sidebar',
            
            // Placeholder de recherche utilisateurs
            searchUserPlaceholder: 'Search by name, email or phone...',
            
            // Edit User - Label mot de passe
            newPasswordOptional: 'New password (optional)',
            leaveBlankToKeep: 'Leave blank to keep unchanged',
            leaveBlankIfNoChange: 'Leave blank if you don\'t want to change the password',
            passwordStrength: 'Password strength:',
            atLeast8Chars: 'At least 8 characters',
            oneUppercase: 'One uppercase letter',
            oneLowercase: 'One lowercase letter',
            oneDigit: 'One digit',
            oneSpecialChar: 'One special character (!@#$%^&*)',
            
            // Type produit - Suppression avec relations
            confirmDeleteWithProducts: 'Warning: Delete with associated products',
            deleteTypeWithProductsMessage: 'This product type contains {{count}} product(s). If you continue, the type will be deleted and products will have no type assigned (products will not be deleted).',
            confirmDeleteAll: 'Yes, delete type',
            continueDelete: 'Continue deletion',
            
            // Date de modification
            modificationDate: 'Modification Date',

            // Orders - Admin
            management: 'Management',
            ordersFound: 'order(s) found',
            totalOrders: 'Total Orders',
            pendingOrders: 'Pending Orders',
            confirmedOrders: 'Confirmed Orders',
            cancelledOrders: 'Cancelled Orders',
            totalRevenue: 'Total Revenue',
            pending: 'Pending',
            confirmed: 'Confirmed',
            cancelled: 'Cancelled',
            filters: 'Filters',
            searchByUserNameOrEmail: 'Username or email...',
            allStatuses: 'All statuses',
            dateRange: 'Date range',
            from: 'From',
            to: 'To',
            applyFilters: 'Apply filters',
            resetFilters: 'Reset filters',
            noOrdersFound: 'No orders found',
            tryModifyingFilters: 'Try modifying your filters to see more orders.',
            order: 'Order',
            customer: 'Customer',
            date: 'Date',
            total: 'Total',
            view: 'View',
            showing: 'Showing',
            of: 'of',
            results: 'results',
            orderNumber: 'Order number',
            orderInformation: 'Order information',
            orderDate: 'Order date',
            confirmationDate: 'Confirmation date',
            totalAmount: 'Total amount',
            orderedProducts: 'Ordered products',
            customerInformation: 'Customer information',
            customerNotes: 'Customer notes',
            adminNotes: 'Admin notes',
            noAdminNotes: 'No admin notes',
            addAdminNotes: 'Add admin notes...',
            noProductsInOrder: 'No products in this order',
            confirm: 'Confirm',
            confirmOrderConfirmation: 'Are you sure you want to confirm this order?',
            confirmOrderCancellation: 'Are you sure you want to cancel this order?',
            orderDetails: 'Order details',
            manageAllOrders: 'Manage all orders',
            orderConfirmedSuccess: 'Order confirmed successfully',
            orderCancelledSuccess: 'Order cancelled successfully',
            errorConfirmingOrder: 'Error confirming order',
            errorCancellingOrder: 'Error cancelling order',

            // Client Components - General
            cart: 'Cart',
            cartIsEmpty: 'Your cart is empty',
            cartEmptyDescription: 'Add some products to start shopping',
            continueShopping: 'Continue shopping',
            cartUpdated: 'Cart updated',
            productRemovedFromCart: 'Product removed from cart',
            clearCart: 'Clear cart',
            confirmClearCart: 'Are you sure you want to clear your cart?',
            cartCleared: 'Cart cleared',
            pleaseSelectPaymentMethod: 'Please select a payment method',
            orderSummary: 'Order summary',
            itemsCount: '{{count}} item(s)',
            proceedToCheckout: 'Proceed to checkout',
            loading: 'Loading...',

            // Checkout Component  
            checkout: 'Checkout',
            finalizingOrder: 'Finalize my order',
            contactInformation: 'Contact information',
            facebookPageOptional: 'Facebook page (optional)',
            instagramOptional: 'Instagram (optional)',
            additionalNotes: 'Additional notes',
            specialInstructions: 'Special instructions, delivery preferences, etc.',
            importantInformation: 'Important information',
            pleaseProvideContact: 'Please provide at least one contact method (Facebook or Instagram) or notes so we can contact you about your order.',
            continue: 'Continue',
            verifyOrder: 'Verify your order',
            checkYourOrder: 'Check your order',
            orderedProducts: 'Ordered products',
            quantity: 'Quantity',
            back: 'Back',
            finalizeOrder: 'Finalize order',
            readyToOrder: 'Ready to order',
            orderWillBeProcessed: 'Your order will be processed as soon as you click "Place order". You will receive a confirmation and we will contact you via the provided methods.',
            processing: 'Processing...',
            placeOrder: 'Place order',
            paymentMethodText: 'Payment method',
            yourCartIsEmpty: 'Your cart is empty',
            orderCreationError: 'Error creating order',

            // Catalog Component
            catalog: 'Catalog',
            searchProducts: 'Search products...',
            priceRange: 'Price range',
            applyFilters: 'Apply filters',
            clearFilters: 'Clear filters',
            noProductsFound: 'No products found',
            tryDifferentFilters: 'Try different filters to see more products',
            addToCart: 'Add to cart',
            viewDetails: 'View details',
            productAddedToCart: 'Product added to cart',
            pleaseSelectPaymentMethodFirst: 'Please select a payment method',
            errorAddingToCart: 'Error adding to cart',
            productInfo: 'Product info',
            contactVendor: 'Contact vendor',

            // Product Detail Component
            productDetails: 'Product details',
            productDescription: 'Description',
            noDescriptionAvailable: 'No description available',
            contactInformationVendor: 'Contact information',
            noContactAvailable: 'No contact information available',
            specifications: 'Specifications',
            pricePerUnit: 'Price per unit',
            availableQuantity: 'Available quantity',
            currency: 'Currency',

            // Order Success Component
            orderSuccess: 'Order confirmed',
            orderPlacedSuccessfully: 'Your order has been placed successfully!',
            orderNumber: 'Order number',
            thankYou: 'Thank you for your order',
            willContactSoon: 'We will contact you soon to confirm the details.',
            orderSummary: 'Order summary',
            backToProducts: 'Back to products',
            viewOrderHistory: 'View order history',

            // Order History Component
            orderHistory: 'Order history',
            myOrders: 'My orders',
            noOrdersYet: 'No orders yet',
            startShoppingDescription: 'You haven\'t placed any orders yet. Start shopping!',
            status: 'Status',
            viewOrder: 'View order',

            // Payment Method Selection Component
            selectPaymentMethod: 'Choose Payment Method',
            welcomeToStore: 'Welcome to your online store',
            selectPaymentMethodDesc: 'Select your preferred payment method to see corresponding prices',
            choosePaymentMethod: 'Choose your payment method',
            paymentMethodAvailable: 'Method available',
            selectMethod: 'Select',
            loadingProducts: 'Loading products...',
            paymentMethodSelected: 'Method {{method}} selected',
            securePaymentGuaranteed: 'Secure payment guaranteed',
            
            // Informational Messages
            methodsAvailableForAllProducts: 'Only methods available for all products are displayed',
            noMethodsAvailable: 'No payment methods available for all products',
            contactAdminForPaymentMethods: 'Please contact the administrator to configure payment methods.',

        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: localStorage.getItem('language') || 'fr',
        fallbackLng: 'fr',
        
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;