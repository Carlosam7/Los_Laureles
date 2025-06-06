import { jsPDF } from "jspdf";

export const InvoceTemplate = (reserva) => {
  const doc = new jsPDF();

  // Colores corporativos extraídos de la imagen
  const amarilloMostaza = "#f9dfbc";
  const marronOscuro = "#7a4928";
  const marronClaro = "#ab6941";
  const negroSuave = "#332413";

  // Fecha y hora de generación
  const now = new Date();
  const fechaGeneracion = now.toLocaleString();

  // Fondo amarillo mostaza en encabezado
  doc.setFillColor(249, 223, 188);
  doc.rect(0, 0, 210, 50, "F"); // altura aumentada a 50mm para dos títulos

  // Título "Factura de Reserva" en marrón oscuro centrado
  doc.setFontSize(24);
  doc.setTextColor(marronOscuro);
  doc.setFont("helvetica", "bold");
  doc.text("Factura de Reserva", 105, 20, { align: "center" });

  // Título "HOTEL LOS LAURELES" debajo, centrado y con tamaño un poco menor
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("HOTEL LOS LAURELES", 105, 38, { align: "center" });

  // Datos cliente y reserva
  doc.setFontSize(12);
  doc.setTextColor(marronOscuro);
  doc.setFont("helvetica", "normal");
  doc.text(`Número de reserva: ${reserva.id_reserve}`, 20, 60);
  doc.text(`Cliente: ${reserva.guest?.name || "N/A"} ${reserva.guest?.last_name || ""}`, 20, 70);

  doc.setTextColor(marronClaro);
  doc.text(`Fecha generación: ${fechaGeneracion}`, 20, 80);

  // Habitaciones reservadas encabezado
  doc.setTextColor(marronOscuro);
  doc.setFont("helvetica", "bold");
  doc.text("Habitaciones reservadas:", 20, 100);

  // Lista de habitaciones
  doc.setFont("helvetica", "normal");
  reserva.reservation_detail.forEach((detail, index) => {
    doc.text(
      `${index + 1}. ${detail.id_room} - ${detail.room?.type_room?.type || "N/A"}`,
      25,
      110 + (index * 10)
    );
  });

  // Línea horizontal decorativa marrón claro debajo
  const totalY = 110 + reserva.reservation_detail.length * 10 + 20;
  doc.setDrawColor(171, 105, 65);
  doc.setLineWidth(1.5);
  doc.line(20, totalY - 10, 190, totalY - 10);

  // Total a pagar destacado en marrón oscuro
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(marronOscuro);
  doc.text(`Total a pagar: $${reserva.total_price.toLocaleString()}`, 20, totalY);

  // Guardar y descargar el PDF
  doc.save(`Factura_Reserva_${reserva.id_reserve}.pdf`);
};

