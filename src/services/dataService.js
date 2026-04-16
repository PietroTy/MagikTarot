/**
 * dataService.js
 * Busca os dados do catálogo no backend.
 * Todos os dados são carregados do servidor para garantir
 * sincronização entre frontend e uma futura base de dados.
 */
import { getApiUrl } from '../config/apiConfig';

async function fetchEndpoint(key) {
    const url = getApiUrl(key);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Erro ao buscar ${key}: ${res.status}`);
    return res.json();
}

export const fetchServices     = () => fetchEndpoint('services');
export const fetchZodiac       = () => fetchEndpoint('zodiac');
export const fetchProducts     = () => fetchEndpoint('products');
export const fetchBlogPosts    = () => fetchEndpoint('blogPosts');
export const fetchTestimonials = () => fetchEndpoint('testimonials');
export const fetchHoroscopes   = () => fetchEndpoint('horoscopes');
export const fetchTarotCards   = () => fetchEndpoint('tarotCards');
export const fetchHowItWorks   = () => fetchEndpoint('howItWorks');
