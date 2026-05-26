export interface Book {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  author: string;
  genre: string;
  year: number;
  isbn: string;
  description: string;
  synopsis: string;
  coverUrl: string;
  price: number;
  stripeProductId?: string;
  stripePriceId?: string;
  contentFile: string;
  previewPercent: number;
  rating?: number;
  reviewCount?: number;
}

export interface Usuario {
  id: string;
  email: string;
  nombre?: string;
  idioma?: string;
  creado_en: string;
  ultimo_login?: string;
  is_admin?: boolean;
}

export interface Compra {
  id: string;
  usuario_id: string;
  email: string;
  producto: string;
  stripe_payment_id?: string;
  monto?: number;
  moneda?: string;
  fecha_pago: string;
  exito: boolean;
}

export interface Entitlement {
  id: string;
  usuario_id: string;
  producto: string;
  concedido_en: string;
  activo: boolean;
}

export interface ReadingProgress {
  id: string;
  usuario_id: string;
  libro_id: string;
  pagina_actual: number;
  palabra_actual: number;
  porcentaje: number;
  actualizado_en: string;
}

export interface Resena {
  id: string;
  usuario_id: string;
  libro_id: string;
  calificacion: number;
  comentario?: string;
  creado_en: string;
  usuario_nombre?: string;
}

export interface Referido {
  id: string;
  codigo: string;
  referidor_id?: string;
  referido_id?: string;
  creado_en: string;
}
