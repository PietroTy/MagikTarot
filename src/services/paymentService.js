/**
 * paymentService.js
 * Gerencia operações de pagamento via Mercado Pago: criação de pedido e polling de status.
 */
import { getApiUrl, getPaymentStatusUrl } from '../config/apiConfig';

/**
 * Cria um pedido no Mercado Pago através do backend.
 * @param {{ serviceId: string, serviceName: string, price: string, formData: object }} payload
 * @returns {Promise<{ orderId: string, checkoutUrl: string, status: string }>}
 */
export async function createOrder(payload) {
    const url = getApiUrl('paymentCreate');
    const res = await fetch(url, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Erro ao criar pedido MP: ${res.status}`);
    }

    return res.json();
}

/**
 * Verifica o status de um pedido.
 * @param {string} orderId
 * @returns {Promise<{ orderId: string, status: 'pending'|'paid'|'expired', paidAt: string|null }>}
 */
export async function checkPaymentStatus(orderId) {
    const url = getPaymentStatusUrl(orderId);
    const res = await fetch(url);
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Erro ao verificar status MP: ${res.status}`);
    }
    return res.json();
}

/**
 * Faz polling do status MP até 'paid' ou timeout.
 * @param {string} orderId
 * @param {{ intervalMs?: number, timeoutMs?: number }} opts
 * @returns {Promise<boolean>} true se pago, false se timeout
 */
export function pollPaymentStatus(orderId, { intervalMs = 3000, timeoutMs = 300000 } = {}) {
    return new Promise((resolve) => {
        const start = Date.now();

        const tick = async () => {
            try {
                const { status } = await checkPaymentStatus(orderId);
                if (status === 'paid') { resolve(true); return; }
                if (status === 'expired') { resolve(false); return; }
            } catch { /* ignora erros pontuais de rede */ }

            if (Date.now() - start >= timeoutMs) { resolve(false); return; }
            setTimeout(tick, intervalMs);
        };

        tick();
    });
}