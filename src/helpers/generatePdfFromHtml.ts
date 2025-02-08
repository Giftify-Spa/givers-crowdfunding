// generatePdfFromHtml.ts
import { jsPDF } from "jspdf";

export const generatePdfFromHtml = (html: string) => {
  // Crea un contenedor temporal y agrega el HTML recibido
  const container = document.createElement("div");
  container.innerHTML = html;
  // Para que no sea visible, lo posicionamos fuera de la vista
  container.style.position = "absolute";
  container.style.left = "-9999px";
  document.body.appendChild(container);

  // Configuramos jsPDF (en este ejemplo usamos orientación portrait y formato A4)
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  // El método html de jsPDF toma un elemento y lo procesa para generar el PDF
  pdf.html(container, {
    callback: function (doc) {
      doc.save("comprobante-donacion.pdf");
      // Eliminamos el contenedor temporal
      document.body.removeChild(container);
    },
    // Ajusta la posición inicial en el PDF
    x: 10,
    y: 10,
  });
};
