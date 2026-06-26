/**
 * Configuração centralizada de URLs
 * Lê REACT_APP_BACKEND_URL do .env.local (dev) ou .env.production (build/deploy)
 */

export const API_CONFIG = {
    BACKEND_URL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:3003',

    ENDPOINTS: {
        chat:         '/chat',
        health:       '/health',
        config:       '/config',
        services:     '/data/services',
        zodiac:       '/data/zodiac',
        products:     '/data/products',
        blogPosts:    '/data/blog-posts',
        testimonials: '/data/testimonials',
        horoscopes:   '/data/horoscopes',
        tarotCards:   '/data/tarot-cards',
        tarotSpreads: '/data/tarot-spreads',
        howItWorks:   '/data/how-it-works',
        paymentCreate: '/payment/create',
        paymentStatus: '/payment/:id/status',
        readings:      '/readings',
        reading:       '/readings/:id',
    }
};

export function getApiUrl(endpoint) {
    const baseUrl = API_CONFIG.BACKEND_URL;
    const path    = API_CONFIG.ENDPOINTS[endpoint] || `/${endpoint}`;
    return `${baseUrl}${path}`;
}

export function getPaymentStatusUrl(orderId) {
    return `${API_CONFIG.BACKEND_URL}/payment/${orderId}/status`;
}

export function getReadingUrl(readingId) {
    return `${API_CONFIG.BACKEND_URL}/readings/${readingId}`;
}
