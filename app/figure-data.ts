import figureArchive from "../visual-archive/figures.json";

export type FigureEntry = {
  id: string;
  zh: string;
  en: string;
  imagePath: string;
  sourcePage: string;
  license: string;
  artist: string;
  representationCaution?: string;
};

type ArchivedFigure = {
  id: string;
  zh: string;
  en: string;
  status: string;
  representationCaution?: string;
  image?: {
    localPath: string;
    commonsPage: string;
    license: string;
    artist: string;
  } | null;
};

function publicAssetPath(path: string) {
  if (typeof window !== "undefined" && window.location.protocol === "file:") {
    return `../public${path}`;
  }
  return path;
}

const archivedFigures = (figureArchive as unknown as { figures: ArchivedFigure[] }).figures
  .filter((figure) => figure.status === "ready" && figure.image)
  .map((figure): FigureEntry => ({
    id: figure.id,
    zh: figure.zh,
    en: figure.en,
    imagePath: publicAssetPath(figure.image!.localPath),
    sourcePage: figure.image!.commonsPage,
    license: figure.image!.license,
    artist: figure.image!.artist,
    representationCaution: figure.representationCaution,
  }));

const supplementedFigures: FigureEntry[] = [
  { id: "eriugena", zh: "约翰·司各脱", en: "John Scotus Eriugena", imagePath: publicAssetPath("/visual-archive/figures/eriugena.jpg"), sourcePage: "https://commons.wikimedia.org/wiki/File:Johannes-Scotus-Erigena.jpg", license: "Copyrighted free use", artist: "Unknown", representationCaution: "中世纪人物的后世插图不是写实肖像，应作为视觉识别符号使用。" },
  { id: "aquinas", zh: "托马斯·阿奎那", en: "Thomas Aquinas", imagePath: publicAssetPath("/visual-archive/figures/aquinas.jpg"), sourcePage: "https://commons.wikimedia.org/wiki/File:Akvinas_Toms.jpg", license: "CC BY-SA 4.0", artist: "Agishev", representationCaution: "中世纪人物的宗教绘画不是写实肖像，应作为视觉识别符号使用。" },
  { id: "erasmus", zh: "伊拉斯谟", en: "Desiderius Erasmus", imagePath: publicAssetPath("/visual-archive/figures/erasmus.jpg"), sourcePage: "https://commons.wikimedia.org/wiki/File:Erasmus.jpg", license: "Public domain", artist: "Hans Holbein the Younger" },
  { id: "thomas-more", zh: "莫尔", en: "Thomas More", imagePath: publicAssetPath("/visual-archive/figures/thomas-more.jpg"), sourcePage: "https://commons.wikimedia.org/wiki/File:Portrait_of_Thomas_More_by_Hans_Holbein_d._J._in_the_Frick_Collection.jpg", license: "Public domain", artist: "Hans Holbein the Younger" },
  { id: "leibniz", zh: "莱布尼茨", en: "Gottfried Wilhelm Leibniz", imagePath: publicAssetPath("/visual-archive/figures/leibniz.jpg"), sourcePage: "https://commons.wikimedia.org/wiki/File:Gottfried_Wilhelm_Leibniz.jpg", license: "Public domain", artist: "Unknown" },
  { id: "hume", zh: "休谟", en: "David Hume", imagePath: publicAssetPath("/visual-archive/figures/hume.jpg"), sourcePage: "https://commons.wikimedia.org/wiki/File:David_Hume.jpg", license: "Public domain", artist: "Allan Ramsay" },
];

const supplementedIds = new Set(supplementedFigures.map((figure) => figure.id));

export const figureEntries = [
  ...archivedFigures.filter((figure) => !supplementedIds.has(figure.id)),
  ...supplementedFigures,
];

export function figuresForChapter(title: string) {
  return figureEntries.filter((figure) => title.includes(figure.zh));
}
