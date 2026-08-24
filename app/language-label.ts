export type LanguageLabel = {
  english: string;
  original?: string;
};

const originalLanguageGlosses: Record<string, string> = {
  "a priori": "a priori",
  "aēr": "air",
  "anankē": "necessity",
  "anamnēsis": "recollection",
  "antilogiai": "opposing arguments",
  "apeiron": "the boundless",
  "aponia": "absence of bodily pain",
  "archē": "first principle",
  "aretē": "virtue",
  "askēsis": "practice",
  "ataraxia": "tranquility",
  "atomon": "atom",
  "autarkeia": "self-sufficiency",
  "clinamen": "atomic swerve",
  "clementia": "clemency",
  "de rerum natura": "On the Nature of Things",
  "daimonion": "divine sign",
  "doxa": "opinions",
  "eidōla": "images",
  "ekpyrōsis": "cosmic conflagration",
  "elenchus": "refutation",
  "epistrophē": "return",
  "epochē": "suspension of judgment",
  "euboulia": "good deliberation",
  "eudaimonia": "flourishing",
  "eulogon": "the reasonable",
  "euthymia": "cheerfulness",
  "hēgemonikon": "ruling faculty",
  "henōsis": "union",
  "harmonia": "harmony",
  "hylomorphism": "matter-form theory",
  "hypostases": "levels of being",
  "isostheneia": "equipollence",
  "katharsis": "purification",
  "kathēkon": "appropriate action",
  "katalēptikē phantasia": "cognitive impression",
  "kosmopolitēs": "citizen of the world",
  "lekton": "sayable",
  "logos": "reason / order",
  "maieutic": "midwifery",
  "methexis": "participation",
  "metempsychosis": "transmigration of souls",
  "mimēsis": "imitation",
  "neikos": "strife",
  "nous": "mind",
  "officium": "duty",
  "ousia": "substance",
  "paracharattein to nomisma": "defacing the currency",
  "parrhēsia": "frank speech",
  "phainomena": "appearances",
  "philia": "friendship",
  "philotēs": "love",
  "phronēsis": "practical wisdom",
  "pithanē phantasia": "persuasive impression",
  "prohairesis": "volition",
  "proficiens": "progressor",
  "prosōpon": "role",
  "psychē": "soul",
  "pneuma": "breath / spirit",
  "personae": "roles",
  "simulacra": "images",
  "sophos": "sage",
  "sympatheia": "cosmic sympathy",
  "synkatathesis": "assent",
  "tetrapharmakos": "four-part cure",
  "theōria": "contemplation",
  "to eon": "what-is",
};

const exactLabels: Record<string, LanguageLabel> = {
  "universal epochē": { english: "universal suspension", original: "epochē" },
};

export function formatLanguageLabel(label: string): LanguageLabel {
  const exact = exactLabels[label.toLocaleLowerCase()];
  if (exact) return exact;

  const parts = label.split(" / ").map((part) => part.trim()).filter(Boolean);
  const original = parts.filter((part) => originalLanguageGlosses[part.toLocaleLowerCase()]);
  const english = parts.filter((part) => !originalLanguageGlosses[part.toLocaleLowerCase()]);

  if (!original.length) return { english: label };
  return {
    english: english.join(" / ") || originalLanguageGlosses[original[0]!.toLocaleLowerCase()] || label,
    original: original.join(" / "),
  };
}
