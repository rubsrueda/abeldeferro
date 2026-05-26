import Image from "next/image";
import Link from "next/link";

export default function AutorPage() {
  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "3rem 1.5rem" }}>
      {/* Header */}
      <div className="section-label" style={{ marginBottom: "0.5rem" }}>
        el autor
      </div>
      <h1
        style={{
          fontSize: "1.75rem",
          color: "#c8a96e",
          letterSpacing: "0.05em",
          marginBottom: "3rem",
        }}
      >
        Abel de Ferro
      </h1>

      {/* Bio section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: "3rem",
          marginBottom: "3rem",
          alignItems: "start",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "280px",
            height: "340px",
            border: "1px solid #2a2a2a",
            overflow: "hidden",
          }}
        >
          <Image
            src="/covers/abel-de-ferro.png"
            alt="Abel de Ferro"
            fill
            style={{ objectFit: "cover", objectPosition: "top" }}
          />
        </div>

        <div>
          <div
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#c8a96e",
              marginBottom: "1rem",
            }}
          >
            Escritor · Historiador · Analista
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              `Abel de Ferro es el pseudónimo de un escritor hispanoamericano cuya obra se sitúa en la intersección entre la historia, la psicología social y el análisis político. Sus textos combinan rigor documental con una prosa directa y sin concesiones.`,
              `Su trabajo parte de una premisa radical: la mayoría de los conflictos que afectan a las sociedades contemporáneas tienen raíces en narrativas falsas, deliberadamente construidas para controlar y dividir. Desenmascarar esas narrativas es, para él, el acto político más subversivo posible.`,
              `"El Imperio Traicionado" (2026) reconstruye el colapso del potencial hispanoamericano desde 1821, documentando cómo la infiltración masónica y la pedagogía del auto-odio destruyeron desde dentro la nación más rica del mundo en su momento.`,
              `"Sombras en el Espejo" aborda la violencia psicológica en las relaciones de pareja con una honestidad que incomoda: ni victimismos ni ideología, solo un mapa claro de los mecanismos que convierten el amor en trampa.`,
              `Abel de Ferro escribe para quienes prefieren la incomodidad de la verdad al confort de la mentira.`,
            ].map((p, i) => (
              <p
                key={i}
                style={{
                  color: i === 4 ? "#c8a96e" : "#aaa",
                  lineHeight: 1.8,
                  fontSize: "0.9rem",
                  fontStyle: i === 4 ? "italic" : "normal",
                }}
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>

      <hr className="divider" />

      {/* Contact */}
      <div style={{ padding: "2rem 0" }}>
        <div className="section-label" style={{ marginBottom: "1rem" }}>
          contacto
        </div>
        <p style={{ color: "#888", fontSize: "0.9rem", marginBottom: "1.5rem", lineHeight: 1.7, maxWidth: "500px" }}>
          Para colaboraciones, conferencias, prensa o cualquier consulta directa:
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <a
            href="mailto:abeldeferro.info@gmail.com"
            style={{
              color: "#c8a96e",
              textDecoration: "none",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            ✉ abeldeferro.info@gmail.com
          </a>
        </div>
      </div>

      <hr className="divider" />

      {/* Obras */}
      <div>
        <div className="section-label" style={{ marginBottom: "1rem" }}>
          obras
        </div>
        <Link href="/catalogo" className="btn-secondary">
          Ver Catálogo Completo →
        </Link>
      </div>

      {/* Mobile responsive */}
      <style>{`
        @media (max-width: 620px) {
          div[style*="grid-template-columns: 280px 1fr"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="grid-template-columns: 280px 1fr"] > div:first-child {
            width: 100% !important;
            height: 240px !important;
          }
        }
      `}</style>
    </div>
  );
}
