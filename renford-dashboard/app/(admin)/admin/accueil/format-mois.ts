export function formatMois(mois: string) {
  const [year, month] = mois.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString("fr-FR", { month: "short", year: "numeric" });
}
