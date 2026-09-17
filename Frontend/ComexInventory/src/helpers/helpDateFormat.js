 // Formatea la fecha que sera mostrada en la tabla
 export function parseaFecha(date) {
    let fixedDate = date.slice(0, 10).split("-");
    fixedDate[1] - 1 < 0
      ? (fixedDate[1] = 11)
      : (fixedDate[1] = fixedDate[1] - 1);
    let fecha = new Date(
      fixedDate[0],
      fixedDate[1],
      fixedDate[2]
    ).toLocaleDateString("es", {
      timeZone: "UTC",
      month: "short",
      day: "2-digit",
      year: "2-digit",
    });
    return fecha;
  }