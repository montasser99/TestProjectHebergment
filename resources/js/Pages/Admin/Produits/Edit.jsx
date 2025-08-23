import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/Admin/AuthenticatedLayoutAdmin';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon, PhotoIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import instantToast from '@/Utils/InstantToast';
import { useState } from 'react';

export default function Edit({ auth, produit, typeProduits, priceMethodes }) {
    const { t, i18n } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        label: produit.label || '',
        description: produit.description || '',
        image: null,
        quantity: produit.quantity || '',
        unit: produit.unit || '',
        currency: produit.currency || 'TND',
        type_produit_id: produit.type_produit_id || '',
        prices: priceMethodes.map(method => {
            const existingPrice = produit.produit_prices?.find(p => p.id_price_methode === method.id);
            return {
                price_methode_id: method.id,
                price: existingPrice ? existingPrice.price : ''
            };
        }),
        contact: {
            instagram_page: produit.contact_social_media?.instagram_page || '',
            facebook_page: produit.contact_social_media?.facebook_page || '',
            whatsapp_number: produit.contact_social_media?.whatsapp_number || '',
            tiktok_page: produit.contact_social_media?.tiktok_page || ''
        },
        _method: 'PUT'
    });

    const [imagePreview, setImagePreview] = useState(
        produit.image ? `/storage/${produit.image}` : null
    );
    const [labelCharCount, setLabelCharCount] = useState(produit.label ? produit.label.length : 0);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleLabelChange = (e) => {
        const value = e.target.value;
        if (value.length <= 100) {
            setData('label', value);
            setLabelCharCount(value.length);
        }
    };

    const removeImage = () => {
        setData('image', null);
        setImagePreview(null);
        document.getElementById('image').value = '';
    };

    const handlePriceChange = (index, value) => {
        const newPrices = [...data.prices];
        newPrices[index].price = value;
        setData('prices', newPrices);
    };

    const handleContactChange = (field, value) => {
        setData('contact', {
            ...data.contact,
            [field]: value
        });
    };

    const submit = (e) => {
        e.preventDefault();
        
        post(route('admin.produits.update', produit.id), {
            forceFormData: true,
            onSuccess: () => {
                instantToast.success(t('productUpdatedSuccess', { name: data.label }));
            },
            onError: (errors) => {
                instantToast.error(t('errorUpdatingProduct'));
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center space-x-3 min-w-0">
                    <Link
                        href="/admin/produits"
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200 flex-shrink-0"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                    </Link>
                    <h2 className="text-lg sm:text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200 truncate">
                        <span className="hidden sm:inline">{t('editProduct')} : </span>{produit.label}
                    </h2>
                </div>
            }
        >
            <Head title={`${t('editProduct')} - ${produit.label}`} />

            <div className="py-8 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="space-y-6 sm:space-y-8">
                        {/* Informations de base */}
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="p-4 sm:p-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                    {t('productInfo')}
                                </h3>
                                
                                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                                    {/* Nom du produit avec limite de 25 caractères */}
                                    <div className="md:col-span-2">
                                        <label htmlFor="label" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            {t('productLabel')} *
                                        </label>
                                        <input
                                            type="text"
                                            id="label"
                                            value={data.label}
                                            onChange={handleLabelChange}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
                                            required
                                            maxLength="100"
                                        />
                                        <div className="flex justify-between items-center mt-1">
                                            <div>
                                                {errors.label && (
                                                    <p className="text-sm text-red-600 dark:text-red-400">{errors.label}</p>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {labelCharCount}/100
                                            </p>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="md:col-span-2">
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            {i18n.language === 'ar' 
                                                ? `(${t('optional')}) ${t('productDescription')}` 
                                                : `${t('productDescription')} (${t('optional')})`}
                                        </label>
                                        <textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            rows="3"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
                                            maxLength="1000"
                                        />
                                        {errors.description && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                                        )}
                                    </div>

                                    {/* Quantité */}
                                    <div>
                                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            {t('productQuantity')} *
                                        </label>
                                        <input
                                            type="number"
                                            id="quantity"
                                            value={data.quantity}
                                            onChange={(e) => setData('quantity', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
                                            required
                                            min="0"
                                            step="0.01"
                                        />
                                        {errors.quantity && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.quantity}</p>
                                        )}
                                    </div>

                                    {/* Unité */}
                                    <div>
                                        <label htmlFor="unit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            {t('productUnit')} *
                                        </label>
                                        <input
                                            type="text"
                                            id="unit"
                                            value={data.unit}
                                            onChange={(e) => setData('unit', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
                                            required
                                            maxLength="50"
                                            placeholder="Ex: Go, diamants, mois, UC..."
                                        />
                                        {errors.unit && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.unit}</p>
                                        )}
                                    </div>

                                    {/* Type de produit */}
                                    <div>
                                        <label htmlFor="type_produit_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            {t('productType')} *
                                        </label>
                                        <select
                                            id="type_produit_id"
                                            value={data.type_produit_id}
                                            onChange={(e) => setData('type_produit_id', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
                                            required
                                        >
                                            <option value="">{t('selectType')}</option>
                                            {typeProduits.map((type) => (
                                                <option key={type.id} value={type.id}>
                                                    {type.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.type_produit_id && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.type_produit_id}</p>
                                        )}
                                    </div>

                                    {/* Devise */}
                                    <div>
                                        <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            {t('productCurrency')}
                                        </label>
                                        <select
                                            id="currency"
                                            value={data.currency}
                                            onChange={(e) => setData('currency', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
                                        >
                                            <option value="TND">TND</option>
                                            <option value="USD">USD</option>
                                            <option value="EUR">EUR</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Image */}
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                    {i18n.language === 'ar' 
                                        ? `(${t('optional')}) ${t('productImage')}` 
                                        : `${t('productImage')} (${t('optional')})`}
                                </h3>
                                
                                <div className="flex items-center space-x-6">
                                    <div className="shrink-0">
                                        <div className="h-32 w-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                                            ) : (
                                                <PhotoIcon className="h-12 w-12 text-gray-400" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            id="image"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-200"
                                        />
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            {t('fileSizeLimit')}
                                        </p>
                                        {imagePreview && (
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="mt-2 text-red-600 hover:text-red-800 text-sm"
                                            >
                                                {t('removeImage')}
                                            </button>
                                        )}
                                        {errors.image && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.image}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Configuration des prix */}
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                    {i18n.language === 'ar' 
                                        ? `(${t('optional')}) ${t('pricesConfiguration')}` 
                                        : `${t('pricesConfiguration')} (${t('optional')})`}
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {priceMethodes.map((method, index) => (
                                        <div key={method.id} className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    {t('priceFor')} {method.methode_name}
                                                </label>
                                                <div className="flex">
                                                    <input
                                                        type="number"
                                                        value={data.prices[index]?.price || ''}
                                                        onChange={(e) => handlePriceChange(index, e.target.value)}
                                                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
                                                        min="0"
                                                        step="0.001"
                                                        placeholder="0.000"
                                                    />
                                                    <span className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-lg bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400 text-sm">
                                                        {data.currency}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {errors.prices && (
                                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.prices}</p>
                                )}
                            </div>
                        </div>

                        {/* Contact réseaux sociaux */}
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                    {i18n.language === 'ar' 
                                        ? `(${t('optional')}) ${t('socialMediaContact')}` 
                                        : `${t('socialMediaContact')} (${t('optional')})`}
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="instagram_page" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            {t('instagramPage')}
                                        </label>
                                        <input
                                            type="text"
                                            id="instagram_page"
                                            value={data.contact.instagram_page}
                                            onChange={(e) => handleContactChange('instagram_page', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
                                            placeholder="@username"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="facebook_page" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            {t('facebookPage')}
                                        </label>
                                        <input
                                            type="text"
                                            id="facebook_page"
                                            value={data.contact.facebook_page}
                                            onChange={(e) => handleContactChange('facebook_page', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
                                            placeholder="Page Name"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="whatsapp_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            {t('whatsappNumber')}
                                        </label>
                                        <input
                                            type="text"
                                            id="whatsapp_number"
                                            value={data.contact.whatsapp_number}
                                            onChange={(e) => handleContactChange('whatsapp_number', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
                                            placeholder="+216 XX XXX XXX"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="tiktok_page" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            {t('tiktokPage')}
                                        </label>
                                        <input
                                            type="text"
                                            id="tiktok_page"
                                            value={data.contact.tiktok_page}
                                            onChange={(e) => handleContactChange('tiktok_page', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
                                            placeholder="@username"
                                        />
                                    </div>
                                </div>
                                
                                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                                    {t('contactNote')}
                                </p>
                            </div>
                        </div>

                        {/* Boutons */}
                        <div className="flex items-center justify-end space-x-4">
                            <Link
                                href="/admin/produits"
                                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                            >
                                {t('cancel')}
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                            >
                                <span>{processing ? t('updating') : t('save')}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}