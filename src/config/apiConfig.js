/**
 * Configuração centralizada de URLs
 * A BACKEND_URL é atualizada automaticamente pelo deploy.sh
 * quando o tunnel Cloudflare sobe.
 */

export const API_CONFIG = {
    // URL do backend — atualizada automaticamente por deploy.sh
    BACKEND_URL: 'http://localhost:3003',

    // Endpoints de catálogo
    ENDPOINTS: {
        // IA / chat legado
        chat: '/chat',

        // Metadados do servidor
        health: '/health',
        config: '/config',

        // Dados estáticos (catálogo)
        services:     '/data/services',
        zodiac:       '/data/zodiac',
        products:     '/data/products',
        blogPosts:    '/data/blog-posts',
        testimonials: '/data/testimonials',
        horoscopes:   '/data/horoscopes',
        tarotCards:   '/data/tarot-cards',
        tarotSpreads: '/data/tarot-spreads',
        howItWorks:   '/data/how-it-works',

        // Pagamentos (Mercado Pago)
        paymentCreate:    '/payment/create',           // POST
        paymentStatus:    '/payment/:id/status',       // GET  (use getPaymentStatusUrl)

        // Leituras
        readings:     '/readings',             // POST / GET
        reading:      '/readings/:id',         // GET  (use getReadingUrl)
    }
};

/**
 * Constrói a URL completa para um endpoint nomeado.
 * @param {string} endpoint - Chave do endpoint em ENDPOINTS
 * @returns {string}
 */
export function getApiUrl(endpoint) {
    const baseUrl = API_CONFIG.BACKEND_URL;
    const path    = API_CONFIG.ENDPOINTS[endpoint] || `/${endpoint}`;
    return `${baseUrl}${path}`;
}

/** URL de status MP para um pedido específico */
export function getPaymentStatusUrl(orderId) {
    return `${API_CONFIG.BACKEND_URL}/payment/${orderId}/status`;
}

/** URL de uma leitura específica */
export function getReadingUrl(readingId) {
    return `${API_CONFIG.BACKEND_URL}/readings/${readingId}`;
}
