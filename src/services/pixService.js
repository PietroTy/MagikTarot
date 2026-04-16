/**
 * pixService.js
 * Gerencia operações de PIX: criação de pedido, polling de status e confirmação.
 *
 * A lógica de geração/conferência real do QR code ainda não está implementada
 * (aguardando definição da API de pagamento).
 */
import { getApiUrl, getPixStatusUrl, getPixConfirmUrl } from '../config/apiConfig';

/**
 * Cria um pedido PIX no backend.
 * @param {{ serviceId: string, serviceName: string, price: string, formData: object }} payload
 * @returns {Promise<{ pixId: string, copyPasteCode: string, qrCodeUrl: string|null, status: string }>}
 */
export async function createPixOrder(payload) {
    const url = getApiUrl('pixCreate');
    const res = await fetch(url, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Erro ao criar pedido PIX: ${res.status}`);
    }

    return res.json();
}

/**
 * Verifica o status de um pedido PIX.
 * @param {string} pixId
 * @returns {Promise<{ pixId: string, status: 'pending'|'paid'|'expired', paidAt: string|null }>}
 */
export async function checkPixStatus(pixId) {
    const url = getPixStatusUrl(pixId);
    const res = await fetch(url);
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Erro ao verificar status PIX: ${res.status}`);
    }
    return res.json();
}

/**
 * Faz polling do status PIX até 'paid' ou timeout.
 * @param {string} pixId
 * @param {{ intervalMs?: number, timeoutMs?: number }} opts
 * @returns {Promise<boolean>} true se pago, false se timeout
 */
export function pollPixStatus(pixId, { intervalMs = 3000, timeoutMs = 300000 } = {}) {
    return new Promise((resolve) => {
        const start = Date.now();

        const tick = async () => {
            try {
                const { status } = await checkPixStatus(pixId);
                if (status === 'paid') { resolve(true); return; }
                if (status === 'expired') { resolve(false); return; }
            } catch { /* ignora erros pontuais de rede */ }

            if (Date.now() - start >= timeoutMs) { resolve(false); return; }
            setTimeout(tick, intervalMs);
        };

        tick();
    });
}

/**
 * Confirma manualmente o pagamento de um pedido (para testes).
 * Remover / restringir quando a API real de webhook estiver ativa.
 * @param {string} pixId
 */
export async function confirmPixManually(pixId) {
    const url = getPixConfirmUrl(pixId);
    const res = await fetch(url, { method: 'POST' });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Erro ao confirmar PIX: ${res.status}`);
    }
    return res.json();
}
