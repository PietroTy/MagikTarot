/**
 * aiService.js
 * Envia mensagens para o backend e retorna a resposta da IA.
 * A partir de agora as leituras exigem um pixId válido e pago.
 */
import { getApiUrl } from '../config/apiConfig';

/**
 * Solicita uma leitura oracular ao backend.
 * Requer que o pixId esteja com status 'paid' no servidor.
 *
 * @param {{ pixId: string, serviceType: string, messages: Array<{role: string, content: string}> }} params
 * @returns {Promise<{ readingId: number, answer: string }>}
 */
export async function solicitarLeitura({ pixId, serviceType, messages }) {
    const url = getApiUrl('readings');
    console.log(`📨 Solicitando leitura ao backend: ${url}`);

    const res = await fetch(url, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ pixId, serviceType, messages }),
    });

    if (res.status === 402) {
        throw new Error('pagamento_pendente');
    }

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Erro ao solicitar leitura: ${res.status}`);
    }

    const data = await res.json();
    if (!data.answer) throw new Error('Resposta inválida do backend');

    return data; // { readingId, answer }
}

/**
 * @deprecated Use solicitarLeitura() — mantido apenas para compatibilidade.
 * Não exige PIX; usa o endpoint /chat legado.
 */
export async function perguntarIA(messages) {
    const url = getApiUrl('chat');
    console.warn('⚠️  perguntarIA() está depreciada. Use solicitarLeitura().');

    const res = await fetch(url, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ messages }),
    });

    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

    const data = await res.json();
    if (!data.answer) throw new Error('Resposta inválida do backend');

    return data.answer;
}