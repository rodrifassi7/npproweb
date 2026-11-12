import React from 'react';
import { MapPin, Store, Truck } from 'lucide-react';
import { CONFIG } from '../../data/data';
import { PAYMENT_METHODS } from '../../utils/order';
import type { Customer } from '../../utils/order';

interface Props {
    value: Customer;
    onChange: (patch: Partial<Customer>) => void;
    /** Días que se pueden elegir (cambia según el tipo de pedido) */
    days: string[];
    /** Aclaración sobre el envío, por ejemplo "Envío gratis" */
    shippingNote?: string;
}

const input = 'w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 text-base text-white placeholder:text-white/30 focus:border-nppro-green focus:outline-none';
const label = 'mb-2 block text-sm font-bold text-white/70';
const choice = (active: boolean) =>
    `flex items-center justify-center gap-2 rounded-2xl border px-4 py-3.5 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nppro-green ${active
        ? 'border-nppro-green bg-nppro-green/10 text-white'
        : 'border-white/10 bg-white/[0.03] text-white/60 hover:border-white/25'}`;

/** Datos para entregar el pedido. Los usan el armador de packs y el carrito. */
const CustomerFields: React.FC<Props> = ({ value, onChange, days, shippingNote }) => (
    <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
            <div>
                <label htmlFor="c-name" className={label}>Nombre y apellido *</label>
                <input id="c-name" type="text" autoComplete="name" value={value.name} onChange={e => onChange({ name: e.target.value })} placeholder="Juan Pérez" className={input} />
            </div>
            <div>
                <label htmlFor="c-phone" className={label}>Teléfono</label>
                <input id="c-phone" type="tel" autoComplete="tel" value={value.phone} onChange={e => onChange({ phone: e.target.value })} placeholder="280 412 3456" className={input} />
            </div>
        </div>

        <div>
            <span className={label}>¿Cómo lo recibís? *</span>
            <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Forma de entrega">
                <button type="button" role="radio" aria-checked={value.deliveryType === 'envio'} onClick={() => onChange({ deliveryType: 'envio' })} className={choice(value.deliveryType === 'envio')}>
                    <Truck size={18} /> Envío a domicilio
                </button>
                <button type="button" role="radio" aria-checked={value.deliveryType === 'retiro'} onClick={() => onChange({ deliveryType: 'retiro' })} className={choice(value.deliveryType === 'retiro')}>
                    <Store size={18} /> Retiro en el local
                </button>
            </div>
            {value.deliveryType === 'envio' ? (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="c-address" className={label}>Dirección en Trelew *</label>
                        <input id="c-address" type="text" autoComplete="street-address" value={value.address} onChange={e => onChange({ address: e.target.value })} placeholder="Calle y altura" className={input} />
                    </div>
                    <div>
                        <label htmlFor="c-ref" className={label}>Referencias</label>
                        <input id="c-ref" type="text" value={value.references} onChange={e => onChange({ references: e.target.value })} placeholder="Depto, entre calles, timbre" className={input} />
                    </div>
                    {shippingNote && <p className="text-sm text-white/55 sm:col-span-2">{shippingNote}</p>}
                </div>
            ) : (
                <p className="mt-4 flex items-start gap-2 text-sm text-white/65">
                    <MapPin size={16} className="mt-0.5 shrink-0 text-nppro-green" />
                    Retirás sin cargo en {CONFIG.PICKUP_ADDRESS}. El horario lo coordinamos por WhatsApp.
                </p>
            )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
            <div>
                <label htmlFor="c-day" className={label}>Día de entrega</label>
                <select id="c-day" value={value.deliveryDay} onChange={e => onChange({ deliveryDay: e.target.value })} className={`${input} appearance-none`}>
                    {days.map(d => <option key={d} value={d} className="bg-[#0B0B0B]">{d === 'A coordinar' ? 'Lo coordinamos por WhatsApp' : d}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="c-pay" className={label}>Forma de pago</label>
                <select id="c-pay" value={value.paymentMethod} onChange={e => onChange({ paymentMethod: e.target.value })} className={`${input} appearance-none`}>
                    {PAYMENT_METHODS.map(m => <option key={m} value={m} className="bg-[#0B0B0B]">{m}</option>)}
                </select>
            </div>
        </div>

        <div>
            <label htmlFor="c-notes" className={label}>Algo que tengamos que saber</label>
            <textarea id="c-notes" rows={2} value={value.notes} onChange={e => onChange({ notes: e.target.value })} placeholder="Horario que te queda mejor, algo que no comés…" className={input} />
        </div>
    </div>
);

export default CustomerFields;
