export const createWhatsAppLink = (
    phone: string,
    packType: 'volumen' | 'definicion',
    items: { name: string; quantity: number; vacuum?: boolean }[],
    totalPrice: number,
    discount?: number
): string => {
    let message = `Hola! 👋 Quiero pedir un *Pack de ${packType === 'volumen' ? 'Volumen' : 'Definición'}*:\n\n`;

    items.forEach(item => {
        message += `• ${item.quantity}x ${item.name}`;
        if (item.vacuum) message += ` (Al vacío)`;
        message += `\n`;
    });

    message += `\n*Total de viandas:* ${items.reduce((acc, i) => acc + i.quantity, 0)}`;

    if (discount) {
        message += `\n*Descuento aplicado:* ${discount * 100}%`;
    }

    message += `\n*Valor aprox:* $${totalPrice}`;
    message += `\n\nQuisiera coordinar el envío y pago. Gracias!`;

    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phone}?text=${encodedMessage}`;
};
