import { Book } from "./types";

export const BOOKS: Book[] = [
  {
    id: "sombras-en-el-espejo",
    slug: "sombras-en-el-espejo",
    title: "Sombras en el Espejo",
    subtitle: "Entendiendo la Violencia Psicológica",
    author: "Abel de Ferro",
    genre: "Ensayo · Psicología",
    year: 2024,
    isbn: "978-XX-XXXXX-01-X",
    description:
      "Una guía valiente y honesta para reconocer, entender y salir de los patrones de violencia psicológica en las relaciones.",
    synopsis: `¿Cómo reconoces que estás siendo manipulado cuando el manipulador nunca levanta la voz?

"Sombras en el Espejo" es un viaje incómodo pero necesario al interior de las relaciones de pareja y las dinámicas de poder que raramente se nombran. Abel de Ferro desmonta con rigor y honestidad los mecanismos de la violencia psicológica: la gaslighting, el control emocional, el aislamiento progresivo y la destrucción sistemática de la autoestima.

Este libro no es una crítica a ningún género. Es un análisis objetivo y documentado de los patrones de comportamiento que convierten una relación en una trampa invisible. Escrito desde la experiencia y la investigación, ofrece herramientas prácticas para identificar estas dinámicas, establecer límites y recuperar la propia narrativa.

Una lectura indispensable para quien quiera entender el amor que daña y el coraje que libera.`,
    coverUrl: "/covers/sombras-en-el-espejo.png",
    price: 12.99,
    stripeProductId: process.env.NEXT_PUBLIC_STRIPE_PRODUCT_SOMBRAS || "",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_SOMBRAS || "",
    contentFile: "libro_sombrasenelespejo.md",
    previewPercent: 10,
    rating: 4.8,
    reviewCount: 47,
  },
  {
    id: "el-imperio-traicionado",
    slug: "el-imperio-traicionado",
    title: "El Imperio Traicionado",
    subtitle:
      "La Leyenda Negra, la traición anglomasónica y el despertar del México que olvidó que nació vencedor",
    author: "Abel de Ferro",
    genre: "Ensayo · Historia",
    year: 2026,
    isbn: "978-XX-XXXXX-02-X",
    description:
      "Un análisis histórico que desvela cómo la ingeniería social y la infiltración política destruyeron el potencial de la América Hispana desde 1821.",
    synopsis: `México no perdió en 1521. México fue traicionado en 1821.

"El Imperio Traicionado" es una obra de investigación histórica que rompe con la narrativa oficial para revelar cómo el Imperio Mexicano —la superpotencia bioceánica más rica del mundo en su momento— fue desmantelado desde adentro mediante un sofisticado plan de infiltración masónica, propaganda psicológica y traición institucional.

Abel de Ferro reconstruye con rigor documental el verdadero colapso de México: no la Conquista de Cortés, sino la ingeniería de Joel Poinsett, las logias yorkinas y la pedagogía del auto-odio que convirtió a los descendientes de los vencedores en creyentes de su propia derrota.

Una obra que cambia la manera en que entiendes la historia de México, España y la América Hispana. Para quien se atreva a recuperar su memoria.`,
    coverUrl: "/covers/el-imperio-traicionado.png",
    price: 14.99,
    stripeProductId: process.env.NEXT_PUBLIC_STRIPE_PRODUCT_IMPERIO || "",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_IMPERIO || "",
    contentFile: "libro_elimperiotraicionado.md",
    previewPercent: 8,
    rating: 4.9,
    reviewCount: 112,
  },
];

export function getBookBySlug(slug: string): Book | undefined {
  return BOOKS.find((b) => b.slug === slug);
}
