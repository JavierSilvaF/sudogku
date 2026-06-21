// England and Scotland have no ISO 3166-1 country code; their flags use the
// Unicode "tag sequence" emoji mechanism instead of regional indicators.
const ENGLAND_FLAG = "\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}";
const SCOTLAND_FLAG = "\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}";

function flagFromIsoCode(isoCode: string): string {
  return isoCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

// Maps each Spanish team name used in the seed data to its ISO 3166-1
// alpha-2 country code (or a literal flag for the rare exceptions).
const TEAM_FLAG_SOURCE: Record<string, string> = {
  "Alemania": "DE",
  "Arabia Saudita": "SA",
  "Argelia": "DZ",
  "Argentina": "AR",
  "Australia": "AU",
  "Austria": "AT",
  "Bosnia/Herzeg.": "BA",
  "Brasil": "BR",
  "Bélgica": "BE",
  "Cabo Verde": "CV",
  "Canadá": "CA",
  "Checa": "CZ",
  "Colombia": "CO",
  "Costa de Marfil": "CI",
  "Croacia": "HR",
  "Curazao": "CW",
  "EE.UU.": "US",
  "Ecuador": "EC",
  "Egipto": "EG",
  "Escocia": SCOTLAND_FLAG,
  "España": "ES",
  "Francia": "FR",
  "Ghana": "GH",
  "Haiti": "HT",
  "IR Irán": "IR",
  "Inglaterra": ENGLAND_FLAG,
  "Iraq": "IQ",
  "Japón": "JP",
  "Jordán": "JO",
  "Marruecos": "MA",
  "México": "MX",
  "Noruega": "NO",
  "Nueva Zelanda": "NZ",
  "Panamá": "PA",
  "Paraguay": "PY",
  "Países Bajos": "NL",
  "Portugal": "PT",
  "Qatar": "QA",
  "RD Congo": "CD",
  "Rep. de Corea": "KR",
  "Senegal": "SN",
  "Sudáfrica": "ZA",
  "Suecia": "SE",
  "Suiza": "CH",
  "Turquía": "TR",
  "Túnez": "TN",
  "Uruguay": "UY",
  "Uzbekistán": "UZ",
};

const TEAM_FLAGS: Record<string, string> = Object.fromEntries(
  Object.entries(TEAM_FLAG_SOURCE).map(([name, code]) => [
    name,
    code.length === 2 ? flagFromIsoCode(code) : code,
  ]),
);

/** Returns the flag emoji for a team name, or "" if there's no match. */
export function getTeamFlag(teamName: string): string {
  return TEAM_FLAGS[teamName] ?? "";
}
