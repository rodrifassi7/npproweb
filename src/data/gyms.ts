export interface GymData {
    name: string;
    code: string;
    waMessage: string;
}

export const GYMS_CONFIG: Record<string, GymData> = {
    corpus: {
        name: "Corpus",
        code: "CORPUS10",
        waMessage: "Hola! Vengo de Corpus y quiero usar el código CORPUS10 para pedir mi pack."
    },
    arena: {
        name: "Arena Training",
        code: "ARENA10",
        waMessage: "Hola! Vengo de Arena Training y quiero usar el código ARENA10 para pedir mi pack."
    },
    calistenia: {
        name: "Calistenia Patagonia",
        code: "CALISTENIA10",
        waMessage: "Hola! Vengo de Calistenia Patagonia y quiero usar el código CALISTENIA10 para pedir mi pack."
    }
};

export const DEFAULT_GYM: GymData = {
    name: "tu gym",
    code: "GYMPOWER10",
    waMessage: "Hola! Quiero usar mi código de descuento para pedir un pack."
};
