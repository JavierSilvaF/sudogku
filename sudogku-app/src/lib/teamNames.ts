// Maps the Spanish team names used in the quiniela sheet to the English
// names commonly returned by worldcup26.ir and similar free APIs, so
// live results can be matched against our seed match list.
export const TEAM_NAME_ALIASES: Record<string, string[]> = {
  "Alemania": ["Germany"],
  "Arabia Saudita": ["Saudi Arabia"],
  "Argelia": ["Algeria"],
  "Argentina": ["Argentina"],
  "Australia": ["Australia"],
  "Austria": ["Austria"],
  "Bosnia/Herzeg.": ["Bosnia and Herzegovina", "Bosnia-Herzegovina", "Bosnia & Herzegovina"],
  "Brasil": ["Brazil"],
  "Bélgica": ["Belgium"],
  "Cabo Verde": ["Cape Verde", "Cabo Verde"],
  "Canadá": ["Canada"],
  "Checa": ["Czech Republic", "Czechia"],
  "Colombia": ["Colombia"],
  "Costa de Marfil": ["Ivory Coast", "Cote d'Ivoire", "Côte d'Ivoire"],
  "Croacia": ["Croatia"],
  "Curazao": ["Curacao", "Curaçao"],
  "EE.UU.": ["United States", "USA", "US"],
  "Ecuador": ["Ecuador"],
  "Egipto": ["Egypt"],
  "Escocia": ["Scotland"],
  "España": ["Spain"],
  "Francia": ["France"],
  "Ghana": ["Ghana"],
  "Haiti": ["Haiti"],
  "IR Irán": ["Iran", "IR Iran"],
  "Inglaterra": ["England"],
  "Iraq": ["Iraq"],
  "Japón": ["Japan"],
  "Jordán": ["Jordan"],
  "Marruecos": ["Morocco"],
  "México": ["Mexico"],
  "Noruega": ["Norway"],
  "Nueva Zelanda": ["New Zealand"],
  "Panamá": ["Panama"],
  "Paraguay": ["Paraguay"],
  "Países Bajos": ["Netherlands", "Holland"],
  "Portugal": ["Portugal"],
  "Qatar": ["Qatar"],
  "RD Congo": ["DR Congo", "Congo DR", "Democratic Republic of the Congo"],
  "Rep. de Corea": ["Korea Republic", "South Korea"],
  "Senegal": ["Senegal"],
  "Sudáfrica": ["South Africa"],
  "Suecia": ["Sweden"],
  "Suiza": ["Switzerland"],
  "Turquía": ["Turkey", "Türkiye"],
  "Túnez": ["Tunisia"],
  "Uruguay": ["Uruguay"],
  "Uzbekistán": ["Uzbekistan"],
};

function normalize(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

const NORMALIZED_ALIASES: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const [spanishName, aliases] of Object.entries(TEAM_NAME_ALIASES)) {
    for (const alias of [spanishName, ...aliases]) {
      map[normalize(alias)] = spanishName;
    }
  }
  return map;
})();

/** Resolves an external API team name back to the Spanish name used in our seed data. */
export function resolveTeamName(externalName: string): string | null {
  return NORMALIZED_ALIASES[normalize(externalName)] ?? null;
}
