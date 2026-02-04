import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CONFIG } from '../data/data';
import { MapPin, Truck, Store, MessageCircle, AlertCircle, Trash2, ShoppingCart, Ticket, Loader2, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Checkout: React.FC = () => {
    const { cart, subtotal, packDiscount, total, vacuumTotal, removeFromCart, currentDiscountTier } = useCart();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        deliveryType: 'envio', // 'envio' | 'retiro'
        address: '',
        references: '',
        deliveryDay: CONFIG.DELIVERY_DAYS[0],
        paymentMethod: 'Transferencia',
        notes: '',
        useVacuumGlobal: false
    });

    // Coupon State
    const [couponCode, setCouponCode] = useState('');
    const [couponStatus, setCouponStatus] = useState<'idle' | 'validating' | 'success' | 'error'>('idle');
    const [couponMessage, setCouponMessage] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; percent: number } | null>(null);

    // Calculated values
    const foodNetTotal = subtotal - packDiscount;
    const couponDiscountAmount = appliedCoupon ? Math.round(foodNetTotal * (appliedCoupon.percent / 100)) : 0;
    const finalTotal = total - couponDiscountAmount;

    // Supabase Validation
    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setCouponStatus('validating');
        setCouponMessage('');

        try {
            // RPC call to validate_coupon
            const { data, error } = await supabase.rpc('validate_coupon', {
                input_code: couponCode,
                input_phone: formData.phone || null
                // FIXME: The user doesn't strictly input "Phone", we have Name/Address. 
                // We should probably ask for Phone in the form if we want per-customer limits? 
                // For now, passing null to skip phone check unless we add phone field.
                // Assuming user wants to enforce it on "Customer Identity" which usually needs phone/email.
            });

            if (error) throw error;

            if (data.valid) {
                // Check if it's the exact same code
                if (appliedCoupon?.code === data.code) {
                    setCouponStatus('success');
                    return;
                }

                setAppliedCoupon({ code: data.code, percent: data.percent });
                setCouponStatus('success');
                setCouponMessage(data.message);
            } else {
                setAppliedCoupon(null);
                setCouponStatus('error');
                setCouponMessage(data.message);
            }
        } catch (err) {
            console.error('Coupon error:', err);
            setAppliedCoupon(null);
            setCouponStatus('error');
            setCouponMessage('Error al validar cupón');
        }
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCheckout = async () => {
        setIsSubmitting(true);
        try {
            // 1. Create Order in Supabase
            const orderData = {
                customer_name: formData.name,
                customer_phone: formData.phone,
                delivery_type: formData.deliveryType,
                address: formData.deliveryType === 'envio' ? formData.address : CONFIG.PICKUP_ADDRESS,
                references: formData.references,
                delivery_day: formData.deliveryDay,
                payment_method: formData.paymentMethod,
                notes: formData.notes,
                items: cart, // Supabase handles JSONB
                subtotal: subtotal,
                total: finalTotal,
                delivery_cost: 0, // Not tracked separately in cart current logic, usually in 'total' or separate
                coupon_code: appliedCoupon?.code || null,
                discount_amount: couponDiscountAmount,
                discount_percent: appliedCoupon?.percent || 0,
                // created_at default now()
            };

            const { error } = await supabase.from('orders').insert([orderData]);

            if (error) {
                console.error("Order save error:", error);
                // Decide: Block or warn? For now, we alert and proceed to WhatsApp anyway as fallback?
                // Or we throw to block? User requested "Order Tracking", implies DB is important.
                alert("Hubo un error guardando el pedido. Por favor, reportalo al enviar el WhatsApp.");
            }

            // 2. Open WhatsApp
            generateWhatsAppLink();

        } catch (e) {
            console.error(e);
            generateWhatsAppLink(); // Fallback
        } finally {
            setIsSubmitting(false);
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
        setCouponStatus('idle');
        setCouponMessage('');
    };

    const { clearCart } = useCart();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const generateWhatsAppLink = () => {
        const { name, deliveryType, address, references, deliveryDay, paymentMethod, notes, useVacuumGlobal } = formData;

        let message = `*NUEVO PEDIDO NPPRO*\n\n`;
        message += `👤 *Nombre:* ${name}\n`;
        if (formData.phone) message += `📱 *Tel:* ${formData.phone}\n`;
        message += `🚚 *Tipo:* ${deliveryType === 'envio' ? 'Envío a domicilio' : 'Retiro en local'}\n`;

        if (deliveryType === 'envio') {
            message += `📍 *Dirección:* ${address}\n`;
            if (references) message += `ℹ️ *Ref:* ${references}\n`;
        } else {
            message += `📍 *Retiro en:* ${CONFIG.PICKUP_ADDRESS}\n`;
        }

        message += `📅 *Día elegido:* ${deliveryDay}\n`;
        message += `💳 *Pago:* ${paymentMethod}\n`;
        if (useVacuumGlobal) message += `❄️ *Envasado al vacío:* Sí\n`;
        if (notes) message += `📝 *Notas:* ${notes}\n\n`;

        message += `*DETALLE DEL PEDIDO:*\n`;
        cart.forEach(item => {
            message += `• ${item.quantity}x ${item.name} ($${item.price * item.quantity})\n`;
        });

        message += `\n*RESUMEN TOTAL:*\n`;
        message += `Subtotal: $${subtotal}\n`;
        if (packDiscount > 0) message += `Descuento Pack (${Math.round(currentDiscountTier?.discount! * 100)}%): -$${packDiscount}\n`;
        if (appliedCoupon) message += `🎟️ Cupón (${appliedCoupon.code}): -$${couponDiscountAmount}\n`;
        if (vacuumTotal > 0) message += `Extra Vacío: $${vacuumTotal}\n`;
        message += `*TOTAL FINAL: $${finalTotal}*\n`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
    };

    if (cart.length === 0) {
        return (
            <div className="pt-40 pb-24 min-h-screen text-center">
                <div className="container mx-auto px-6">
                    <div className="glass max-w-lg mx-auto p-12 rounded-[40px]">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
                            <ShoppingCart size={32} className="text-nppro-gray" />
                        </div>
                        <h2 className="text-3xl font-black italic mb-4 uppercase">Tu carrito está vacío</h2>
                        <p className="text-nppro-gray mb-10">Agregá algunas viandas deliciosas para comenzar.</p>
                        <Link to="/menu" className="btn-primary">Ver Menú</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-24 min-h-screen">
            <div className="container mx-auto px-6">
                <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-12 uppercase">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Form Side */}
                    <div className="lg:col-span-7 space-y-8">

                        {/* Personal Data */}
                        <div className="glass p-8 rounded-[32px]">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-3"><div className="w-1.5 h-6 bg-nppro-green rounded-full" /> TUS DATOS</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-nppro-gray uppercase tracking-widest mb-2 ml-1">Nombre completo *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Ej: Juan Pérez"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-nppro-green/50 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-nppro-gray uppercase tracking-widest mb-2 ml-1">Teléfono (WhatsApp)</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="Ej: 11 1234 5678"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-nppro-green/50 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Delivery Type */}
                        <div className="glass p-8 rounded-[32px]">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-3"><div className="w-1.5 h-6 bg-nppro-green rounded-full" /> ENTREGA</h2>

                            <div className="grid grid-cols-2 gap-4 mb-8 text-center">
                                <button
                                    onClick={() => setFormData(prev => ({ ...prev, deliveryType: 'envio' }))}
                                    className={`p-6 rounded-3xl border transition-all flex flex-col items-center gap-3 ${formData.deliveryType === 'envio' ? 'bg-nppro-green/10 border-nppro-green text-white shadow-[0_0_20px_rgba(22,163,74,0.2)]' : 'bg-white/5 border-white/10 text-nppro-gray'}`}
                                >
                                    <Truck size={28} />
                                    <span className="font-bold">Envío</span>
                                </button>
                                <button
                                    onClick={() => setFormData(prev => ({ ...prev, deliveryType: 'retiro' }))}
                                    className={`p-6 rounded-3xl border transition-all flex flex-col items-center gap-3 ${formData.deliveryType === 'retiro' ? 'bg-nppro-green/10 border-nppro-green text-white shadow-[0_0_20px_rgba(22,163,74,0.2)]' : 'bg-white/5 border-white/10 text-nppro-gray'}`}
                                >
                                    <Store size={28} />
                                    <span className="font-bold">Retiro</span>
                                </button>
                            </div>

                            {formData.deliveryType === 'envio' ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-nppro-gray uppercase tracking-widest mb-2 ml-1">Dirección de entrega *</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            placeholder="Calle y altura"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-nppro-green/50 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-nppro-gray uppercase tracking-widest mb-2 ml-1">Referencias de la zona</label>
                                        <input
                                            type="text"
                                            name="references"
                                            value={formData.references}
                                            onChange={handleInputChange}
                                            placeholder="Ej: Entre calles, frente a plaza..."
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-nppro-green/50 transition-all"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="p-6 bg-white/5 rounded-2xl border border-white/5 flex items-start gap-4">
                                    <MapPin className="text-nppro-green mt-1 shrink-0" size={20} />
                                    <div>
                                        <div className="font-bold mb-1">Punto de retiro</div>
                                        <p className="text-sm text-nppro-gray">{CONFIG.PICKUP_ADDRESS}</p>
                                        <p className="text-xs text-nppro-green mt-2 font-bold uppercase tracking-tighter">Coordinar horario por WhatsApp</p>
                                    </div>
                                </div>
                            )}


                        </div>

                        {/* Payment & Extras */}
                        <div className="glass p-8 rounded-[32px]">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-3"><div className="w-1.5 h-6 bg-nppro-green rounded-full" /> PAGO Y EXTRAS</h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-nppro-gray uppercase tracking-widest mb-4 ml-1">Medio de pago</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {['Transferencia', 'Mercado Pago', 'Efectivo'].map(method => (
                                            <label key={method} className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${formData.paymentMethod === method ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/5 opacity-50'}`}>
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value={method}
                                                    checked={formData.paymentMethod === method}
                                                    onChange={handleInputChange}
                                                    className="hidden"
                                                />
                                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === method ? 'border-nppro-green' : 'border-white/20'}`}>
                                                    {formData.paymentMethod === method && <div className="w-2 h-2 bg-nppro-green rounded-full" />}
                                                </div>
                                                <span className="font-bold text-sm tracking-tight">{method}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/10">
                                    <label className="flex items-center gap-4 cursor-pointer group">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                name="useVacuumGlobal"
                                                checked={formData.useVacuumGlobal}
                                                onChange={handleInputChange}
                                                className="sr-only peer"
                                            />
                                            <div className="w-14 h-7 bg-white/10 peer-checked:bg-nppro-green rounded-full transition-all border border-white/10"></div>
                                            <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-all peer-checked:translate-x-7"></div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-sm">¿Envasar todo al vacío?</div>
                                            <p className="text-[10px] text-nppro-gray uppercase font-bold mt-0.5">+ ${CONFIG.VACUUM_PRICE_PER_ITEM} por comida • Ideal para durar +10 días</p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cart View / Summary Side */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-32 glass rounded-[40px] overflow-hidden border-white/10">
                            <div className="p-8 border-b border-white/5">
                                <h2 className="text-2xl font-black italic mb-2 uppercase flex items-center justify-between">
                                    Resumen <span className="text-nppro-gray text-sm font-bold tracking-widest">{cart.length} LÍNEAS</span>
                                </h2>
                                <button
                                    onClick={clearCart}
                                    className="text-[10px] font-black text-red-500/50 hover:text-red-500 uppercase tracking-widest transition-colors flex items-center gap-1"
                                >
                                    <Trash2 size={10} /> Vaciar Carrito
                                </button>
                            </div>

                            <div className="max-h-[40vh] overflow-y-auto p-8 space-y-4">
                                {cart.map(item => (
                                    <div key={item.key} className="flex gap-4 group">
                                        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                                            <img src={item.image} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between font-bold text-sm">
                                                <span className="truncate">{item.quantity}x {item.name} {item.useVacuum && <span className="text-[9px] text-nppro-green font-black ml-1">(VACÍO)</span>}</span>
                                                <span>${item.price * item.quantity + (item.useVacuum ? CONFIG.vacuumExtraPrice * item.quantity : 0)}</span>
                                            </div>
                                            <div className="flex justify-between mt-1">
                                                <span className="text-[10px] text-nppro-gray font-black uppercase tracking-widest">{item.category}</span>
                                                <button onClick={() => removeFromCart(item.key)} className="text-red-500/50 hover:text-red-500 transition-colors">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-8 bg-white/5 space-y-4 border-t border-white/10 text-sm">
                                <div className="flex justify-between text-nppro-gray">
                                    <span>Productos</span>
                                    <span>${subtotal}</span>
                                </div>
                                {packDiscount > 0 && (
                                    <div className="flex justify-between text-nppro-green font-bold">
                                        <span>Descuento Pack</span>
                                        <span>-${packDiscount}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-nppro-gray italic">
                                    <span>Extra al vacío</span>
                                    <span>+${vacuumTotal}</span>
                                </div>

                                {/* Coupon Section */}
                                <div className="pt-4 border-t border-white/10 space-y-3">
                                    {!appliedCoupon ? (
                                        <div className="space-y-2">
                                            <div className="flex gap-2">
                                                <div className="relative flex-1">
                                                    <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 text-nppro-gray" size={16} />
                                                    <input
                                                        type="text"
                                                        value={couponCode}
                                                        onChange={(e) => setCouponCode(e.target.value)}
                                                        placeholder="Código de descuento"
                                                        className="w-full bg-black/20 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-nppro-green/50"
                                                        onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                                                    />
                                                </div>
                                                <button
                                                    onClick={handleApplyCoupon}
                                                    disabled={!couponCode || couponStatus === 'validating'}
                                                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
                                                >
                                                    {couponStatus === 'validating' ? <Loader2 className="animate-spin" size={16} /> : 'Aplicar'}
                                                </button>
                                            </div>
                                            {couponStatus === 'error' && (
                                                <p className="text-xs text-red-500 font-bold ml-1">{couponMessage}</p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="bg-nppro-green/10 border border-nppro-green/30 rounded-xl p-3 flex items-center justify-between">
                                            <div>
                                                <div className="text-nppro-green font-bold text-sm flex items-center gap-2">
                                                    <Ticket size={14} /> {appliedCoupon.code}
                                                </div>
                                                <div className="text-xs text-nppro-green/80 font-medium">
                                                    {appliedCoupon.percent}% OFF aplicado
                                                </div>
                                            </div>
                                            <button onClick={removeCoupon} className="text-nppro-green/60 hover:text-nppro-green transition-colors">
                                                <X size={16} />
                                            </button>
                                        </div>
                                    )}

                                    {appliedCoupon && (
                                        <div className="flex justify-between text-nppro-green font-bold">
                                            <span>Descuento Cupón</span>
                                            <span>-${couponDiscountAmount}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                                    <div className="font-black italic uppercase text-lg tracking-tighter">TOTAL A PAGAR</div>
                                    <div className="text-3xl font-black text-nppro-green shadow-green-500/20 drop-shadow-sm">
                                        ${finalTotal}
                                    </div>
                                </div>
                            </div>

                            <div className="p-8">
                                <button
                                    disabled={!formData.name || (formData.deliveryType === 'envio' && !formData.address) || isSubmitting}
                                    onClick={handleCheckout}
                                    className="btn-primary w-full py-5 text-lg shadow-xl shadow-nppro-green/20 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="animate-spin" size={24} />
                                            <span>Procesando...</span>
                                        </>
                                    ) : (
                                        <>
                                            Confirmar por WhatsApp <MessageCircle size={24} />
                                        </>
                                    )}
                                </button>
                                <div className="flex items-center gap-2 justify-center mt-6 text-[10px] text-nppro-gray font-black uppercase tracking-[0.2em]">
                                    <AlertCircle size={12} /> Coordinamos el pago por privado
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Checkout;
