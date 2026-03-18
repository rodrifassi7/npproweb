export const createWhatsAppLink = (
    phone: string,
    packType: 'volumen' | 'definicion',
    items: { name: string; quantity: number; vacuum?: boolean }[],
    totalPrice: number,
    discount?: number,
    premadePackName?: string
): string => {
    const totalViandas = items.reduce((acc, i) => acc + i.quantity, 0);

    // Usamos emojis estándar que WhatsApp reconoce siempre
    let message = `*NUEVO PEDIDO - NPPRO*\n`;
    message += `---------------------------\n\n`;

    // Nombre del pack o tipo
    const tituloPack = premadePackName ? premadePackName.toUpperCase() : `PACK ${packType.toUpperCase()}`;
    message += `*Pack:* ${tituloPack}\n`;
    message += `*Objetivo:* ${packType === 'volumen' ? 'Volumen' : 'Definición'}\n`;
    message += `*Cantidad:* ${totalViandas} viandas\n\n`;

    // Detalle de los platos
    message += `*DETALLE:*\n`;
    items.forEach(item => {
        // El punto (•) es seguro, pero un guion (-) es aún más compatible
        message += `- ${item.quantity}x ${item.name}${item.vacuum ? ' _(Al vacío)_' : ''}\n`;
    });

    message += `\n---------------------------\n`;

    // Precios
    if (discount && discount > 0) {
        message += `*Descuento:* ${discount * 100}%\n`;
    }

    message += `*VALOR TOTAL: $${totalPrice.toLocaleString('es-AR')}*\n`;

    // Envío bonificado si corresponde
    if (totalViandas >= 10) {
        message += `_Este pedido incluye Envío Bonificado_\n`;
    }

    message += `\n---------------------------\n`;
    message += `Quisiera coordinar el envío y pago. ¡Gracias!`;

    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phone}?text=${encodedMessage}`;
};