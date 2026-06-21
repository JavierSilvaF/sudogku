// England and Scotland have no ISO 3166-1 country code; their flag emoji
// use the Unicode "tag sequence" mechanism instead of regional indicators.
// flagcdn.com (used for the desktop image flags) accepts their ISO 3166-2
// subdivision codes ("gb-eng"/"gb-sct") directly, so those live in the same
// code map below and only need a separate emoji override.
const ENGLAND_FLAG_EMOJI = "\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}";
const SCOTLAND_FLAG_EMOJI = "\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}";

const EMOJI_OVERRIDES: Record<string, string> = {
  "Escocia": SCOTLAND_FLAG_EMOJI,
  "Inglaterra": ENGLAND_FLAG_EMOJI,
};

function flagEmojiFromIsoCode(isoCode: string): string {
  return isoCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

// Maps each Spanish team name used in the seed data to its ISO 3166-1
// alpha-2 code (lowercase, as flagcdn.com expects).
const TEAM_ISO_CODE: Record<string, string> = {
  "Alemania": "de",
  "Arabia Saudita": "sa",
  "Argelia": "dz",
  "Argentina": "ar",
  "Australia": "au",
  "Austria": "at",
  "Bosnia/Herzeg.": "ba",
  "Brasil": "br",
  "Bélgica": "be",
  "Cabo Verde": "cv",
  "Canadá": "ca",
  "Checa": "cz",
  "Colombia": "co",
  "Costa de Marfil": "ci",
  "Croacia": "hr",
  "Curazao": "cw",
  "EE.UU.": "us",
  "Ecuador": "ec",
  "Egipto": "eg",
  "Escocia": "gb-sct",
  "España": "es",
  "Francia": "fr",
  "Ghana": "gh",
  "Haiti": "ht",
  "IR Irán": "ir",
  "Inglaterra": "gb-eng",
  "Iraq": "iq",
  "Japón": "jp",
  "Jordán": "jo",
  "Marruecos": "ma",
  "México": "mx",
  "Noruega": "no",
  "Nueva Zelanda": "nz",
  "Panamá": "pa",
  "Paraguay": "py",
  "Países Bajos": "nl",
  "Portugal": "pt",
  "Qatar": "qa",
  "RD Congo": "cd",
  "Rep. de Corea": "kr",
  "Senegal": "sn",
  "Sudáfrica": "za",
  "Suecia": "se",
  "Suiza": "ch",
  "Turquía": "tr",
  "Túnez": "tn",
  "Uruguay": "uy",
  "Uzbekistán": "uz",
};

const TEAM_FLAG_EMOJI: Record<string, string> = Object.fromEntries(
  Object.entries(TEAM_ISO_CODE).map(([name, code]) => [
    name,
    EMOJI_OVERRIDES[name] ?? flagEmojiFromIsoCode(code),
  ]),
);

/** Returns the flag emoji for a team name, or "" if there's no match. */
export function getTeamFlag(teamName: string): string {
  return TEAM_FLAG_EMOJI[teamName] ?? "";
}

/**
 * Returns a flagcdn.com flag image URL for a team name, or "" if there's no
 * match. Emoji flags don't render as pictures on most desktop browsers
 * (Windows in particular falls back to showing the two-letter code), so this
 * is used as a desktop-only image alternative to the emoji.
 */
export function getTeamFlagImageUrl(teamName: string): string {
  const code = TEAM_ISO_CODE[teamName];
  return code ? `https://flagcdn.com/h40/${code}.png` : "";
}
