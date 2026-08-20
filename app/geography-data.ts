export type HistoricalPlaceContext = {
  period: string;
  ancientOrPeriodName: string;
  politicalContext: string;
  mapScope: string;
  note: string;
};

export type GeographyEntry = {
  id: string;
  nameZh: string;
  nameEn: string;
  kind: "city" | "region" | "empire";
  modernLocation: string;
  latitude: number;
  longitude: number;
  zoom: number;
  historicalContexts: HistoricalPlaceContext[];
  modernMapUrl: string;
  historicalGazetteerUrl: string;
};

const osm = (lat: number, lon: number, zoom: number) => `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=${zoom}/${lat}/${lon}`;
const pleiades = (name: string) => `https://pleiades.stoa.org/search?SearchableText=${encodeURIComponent(name)}`;

const place = (
  id: string,
  nameZh: string,
  nameEn: string,
  kind: GeographyEntry["kind"],
  modernLocation: string,
  latitude: number,
  longitude: number,
  zoom: number,
  historicalContexts: HistoricalPlaceContext[],
): GeographyEntry => ({ id, nameZh, nameEn, kind, modernLocation, latitude, longitude, zoom, historicalContexts, modernMapUrl: osm(latitude, longitude, zoom), historicalGazetteerUrl: pleiades(nameEn) });

export const geographyEntries: GeographyEntry[] = [
  place("miletus", "米利都", "Miletus", "city", "土耳其艾登省巴拉特附近", 37.5308, 27.2784, 11, [
    { period: "前 7—5 世纪", ancientOrPeriodName: "Miletos", politicalContext: "爱奥尼亚希腊城邦，后受吕底亚与波斯控制", mapScope: "爱琴海东岸与小亚细亚", note: "泰勒斯、阿那克西曼德和阿那克西美尼的城市；古代海岸线与今天不同。" },
  ]),
  place("ionia", "爱奥尼亚", "Ionia", "region", "土耳其西部爱琴海沿岸", 38.15, 27.25, 7, [
    { period: "前 8—5 世纪", ancientOrPeriodName: "Ionia", politicalContext: "由多个希腊城邦组成的沿海文化区", mapScope: "爱琴海、小亚细亚西岸及邻近岛屿", note: "早期自然哲学的重要环境，也是希波冲突的前沿。" },
  ]),
  place("ephesus", "以弗所", "Ephesus", "city", "土耳其塞尔丘克附近", 37.939, 27.341, 12, [
    { period: "前 6—5 世纪", ancientOrPeriodName: "Ephesos", politicalContext: "爱奥尼亚城邦", mapScope: "爱琴海东岸", note: "赫拉克利特的故乡；古港今日已因淤积远离海岸。" },
  ]),
  place("elea", "埃利亚", "Elea / Velia", "city", "意大利坎帕尼亚大区阿谢亚附近", 40.159, 15.154, 12, [
    { period: "前 6—4 世纪", ancientOrPeriodName: "Elea", politicalContext: "大希腊的福凯亚殖民城邦", mapScope: "南意大利与西地中海", note: "巴门尼德和埃利亚学派的活动中心。" },
  ]),
  place("sicily", "西西里", "Sicily", "region", "意大利西西里大区", 37.6, 14.0, 7, [
    { period: "前 6—3 世纪", ancientOrPeriodName: "Sikelia", politicalContext: "希腊城邦、迦太基势力与本地社群竞争", mapScope: "中地中海", note: "恩培多克勒等大希腊思想家的历史环境。" },
  ]),
  place("acragas", "阿克拉加斯", "Acragas / Agrigento", "city", "意大利西西里大区阿格里真托", 37.311, 13.576, 11, [
    { period: "前 6—4 世纪", ancientOrPeriodName: "Akragas", politicalContext: "富裕的西西里希腊城邦，经历僭主、寡头与民主竞争", mapScope: "西西里与中地中海", note: "恩培多克勒的故乡；神庙谷保存了城邦繁荣时期的重要遗迹。" },
  ]),
  place("clazomenae", "克拉佐梅奈", "Clazomenae", "city", "土耳其伊兹密尔省乌尔拉附近", 38.36, 26.77, 11, [
    { period: "前 6—5 世纪", ancientOrPeriodName: "Klazomenai", politicalContext: "爱奥尼亚城邦，先后处于吕底亚和波斯势力范围", mapScope: "爱琴海东岸与小亚细亚", note: "阿那克萨哥拉的出生地，也是爱奥尼亚自然研究进入雅典之前的背景。" },
  ]),
  place("lampsacus", "兰普萨库斯", "Lampsacus", "city", "土耳其恰纳卡莱省拉普塞基附近", 40.344, 26.685, 11, [
    { period: "前 5—4 世纪", ancientOrPeriodName: "Lampsakos", politicalContext: "赫勒斯滂海峡沿岸希腊城邦", mapScope: "爱琴海、黑海入口与小亚细亚", note: "传统称阿那克萨哥拉离开雅典后在此教学并去世。" },
  ]),
  place("athens", "雅典", "Athens", "city", "希腊阿提卡大区", 37.9838, 23.7275, 11, [
    { period: "前 5—4 世纪", ancientOrPeriodName: "Athenai", politicalContext: "民主城邦与海上帝国", mapScope: "阿提卡、爱琴海和希腊城邦世界", note: "苏格拉底、柏拉图和亚里士多德活动的核心城市。" },
    { period: "前 3—1 世纪", ancientOrPeriodName: "Athens", politicalContext: "希腊化与罗马势力下的学术城市", mapScope: "希腊化地中海", note: "花园学派、斯多葛学派和学院继续在此教学。" },
  ]),
  place("sparta", "斯巴达", "Sparta", "city", "希腊拉科尼亚专区", 37.0755, 22.4297, 10, [
    { period: "前 6—4 世纪", ancientOrPeriodName: "Sparta / Lakedaimon", politicalContext: "伯罗奔尼撒军事城邦", mapScope: "伯罗奔尼撒与希腊城邦联盟", note: "其纪律和混合政体深刻影响柏拉图的政治想象。" },
  ]),
  place("abdera", "阿布德拉", "Abdera", "city", "希腊色雷斯克桑西附近", 40.981, 24.952, 11, [
    { period: "前 5—4 世纪", ancientOrPeriodName: "Abdera", politicalContext: "色雷斯海岸希腊城邦", mapScope: "爱琴海北岸与色雷斯", note: "留基伯和德谟克利特的原子论传统与此地相关。" },
  ]),
  place("pella", "佩拉／马其顿", "Pella / Macedon", "region", "希腊中马其顿大区", 40.761, 22.526, 9, [
    { period: "前 4 世纪", ancientOrPeriodName: "Makedonia", politicalContext: "腓力二世和亚历山大的马其顿王国", mapScope: "巴尔干、爱琴海与波斯帝国", note: "城邦政治向希腊化帝国世界转变的权力起点。" },
  ]),
  place("alexandria", "亚历山大里亚", "Alexandria", "city", "埃及亚历山大省", 31.2001, 29.9187, 10, [
    { period: "前 331 年—公元 4 世纪", ancientOrPeriodName: "Alexandreia", politicalContext: "托勒密王国首都，后为罗马帝国大城", mapScope: "东地中海、埃及与近东", note: "图书馆、数学、犹太思想、基督教神学和新柏拉图主义的交汇处。" },
  ]),
  place("egypt", "埃及", "Egypt", "region", "现代埃及", 26.8, 30.8, 5, [
    { period: "前 4 世纪—公元 7 世纪", ancientOrPeriodName: "Aigyptos / Aegyptus", politicalContext: "托勒密王国、罗马行省与拜占庭领地", mapScope: "尼罗河流域与东地中海", note: "古代科学、宗教和基督教教父传统的重要地理背景。" },
  ]),
  place("persian-empire", "波斯帝国", "Persian Empire", "empire", "以现代伊朗为中心的跨区域历史帝国", 32.0, 53.0, 4, [
    { period: "前 550—330", ancientOrPeriodName: "Achaemenid Empire", politicalContext: "阿契美尼德帝国", mapScope: "从爱琴海、埃及到中亚和印度河", note: "与爱奥尼亚城邦冲突，并被亚历山大征服。" },
  ]),
  place("rome", "罗马", "Rome", "city", "意大利拉齐奥大区", 41.9028, 12.4964, 10, [
    { period: "前 1 世纪—公元 4 世纪", ancientOrPeriodName: "Roma", politicalContext: "共和国晚期与罗马帝国首都", mapScope: "整个地中海帝国", note: "希腊哲学进入帝国精英教育，后又成为拉丁基督教中心。" },
    { period: "4—13 世纪", ancientOrPeriodName: "Roma", politicalContext: "西部教会和教皇制中心", mapScope: "拉丁西欧与教皇领地", note: "帝国政治首都衰落后，宗教与制度象征性仍然延续。" },
  ]),
  place("hippo", "希波／北非", "Hippo Regius / North Africa", "city", "阿尔及利亚安纳巴附近", 36.88, 7.75, 10, [
    { period: "4—5 世纪", ancientOrPeriodName: "Hippo Regius", politicalContext: "罗马北非城市与主教区", mapScope: "罗马北非、西地中海", note: "奥古斯丁长期担任主教并写作的地点。" },
  ]),
  place("jerusalem", "耶路撒冷", "Jerusalem", "city", "现代耶路撒冷", 31.778, 35.235, 11, [
    { period: "前 1 世纪—公元 2 世纪", ancientOrPeriodName: "Hierosolyma / Jerusalem", politicalContext: "犹太地区宗教中心，后受罗马控制", mapScope: "犹太地区与东地中海", note: "犹太教、早期基督教和救赎史叙事的核心地点。" },
  ]),
  place("antioch", "安条克／东地中海", "Antioch", "city", "土耳其安塔基亚附近", 36.202, 36.161, 10, [
    { period: "前 3 世纪—公元 6 世纪", ancientOrPeriodName: "Antiocheia", politicalContext: "塞琉古、罗马和拜占庭时期的大都市", mapScope: "叙利亚、安纳托利亚与东地中海", note: "早期基督教宣教及希腊、叙利亚文化交流的重要节点。" },
  ]),
  place("constantinople", "君士坦丁堡", "Constantinople / Istanbul", "city", "土耳其伊斯坦布尔", 41.0082, 28.9784, 10, [
    { period: "330—1453", ancientOrPeriodName: "Constantinopolis", politicalContext: "东罗马／拜占庭帝国首都", mapScope: "巴尔干、安纳托利亚与东地中海", note: "希腊典籍保存、帝国神学及十五世纪知识迁移的重要中心。" },
  ]),
  place("monte-cassino", "卡西诺山", "Monte Cassino", "city", "意大利拉齐奥大区卡西诺", 41.49, 13.814, 12, [
    { period: "6 世纪以后", ancientOrPeriodName: "Mons Casinus", politicalContext: "本尼狄克修道院", mapScope: "意大利与拉丁西欧修道网络", note: "本尼狄克规则与西欧修道制度的象征性地点。" },
  ]),
  place("ireland", "爱尔兰", "Ireland", "region", "现代爱尔兰岛", 53.3, -8.0, 6, [
    { period: "6—9 世纪", ancientOrPeriodName: "Hibernia", politicalContext: "修道院教育与拉丁学术网络", mapScope: "不列颠群岛与法兰克世界", note: "中世纪早期典籍保存和约翰·司各脱背景的重要区域。" },
  ]),
  place("aachen", "亚琛／法兰克宫廷", "Aachen", "city", "德国北莱茵—威斯特法伦州", 50.7753, 6.0839, 10, [
    { period: "8—9 世纪", ancientOrPeriodName: "Aquisgranum", politicalContext: "加洛林帝国宫廷中心", mapScope: "西欧与法兰克帝国", note: "查理曼教育改革和宫廷学术网络的地理中心。" },
  ]),
  place("baghdad", "巴格达", "Baghdad", "city", "伊拉克巴格达省", 33.3152, 44.3661, 10, [
    { period: "8—10 世纪", ancientOrPeriodName: "Madinat al-Salam / Baghdad", politicalContext: "阿拔斯王朝首都", mapScope: "伊斯兰世界、波斯与东地中海", note: "翻译运动、数学、医学和哲学综合的重要中心。" },
  ]),
  place("persia", "波斯", "Persia / Iran", "region", "现代伊朗", 32.0, 53.0, 5, [
    { period: "9—12 世纪", ancientOrPeriodName: "Iran / Persian lands", politicalContext: "多个伊斯兰王朝和学术城市", mapScope: "伊朗高原、中亚与伊拉克", note: "阿维森纳等哲学家、医学家活动的广阔文化区域。" },
  ]),
  place("cordoba", "科尔多瓦／安达卢西亚", "Córdoba / al-Andalus", "city", "西班牙安达卢西亚自治区", 37.8882, -4.7794, 10, [
    { period: "8—13 世纪", ancientOrPeriodName: "Qurtuba", politicalContext: "倭马亚及后续安达卢西亚政权的重要城市", mapScope: "伊比利亚、北非与西地中海", note: "阿威罗伊、迈蒙尼德及阿拉伯—拉丁知识传播的重要环境。" },
  ]),
  place("cairo", "开罗", "Cairo", "city", "埃及开罗省", 30.0444, 31.2357, 10, [
    { period: "10—13 世纪", ancientOrPeriodName: "al-Qahira", politicalContext: "法蒂玛和阿尤布时期大城", mapScope: "埃及、北非与东地中海", note: "犹太、伊斯兰和医学知识网络的重要节点，迈蒙尼德后期活动地。" },
  ]),
  place("paris", "巴黎", "Paris", "city", "法国法兰西岛大区", 48.8566, 2.3522, 10, [
    { period: "12—14 世纪", ancientOrPeriodName: "Paris", politicalContext: "法国王权与巴黎大学中心", mapScope: "法兰西王国与拉丁大学网络", note: "阿奎那、司各脱及经院争论的主要制度空间。" },
  ]),
  place("oxford", "牛津", "Oxford", "city", "英国牛津郡", 51.752, -1.2577, 11, [
    { period: "12—14 世纪", ancientOrPeriodName: "Oxford", politicalContext: "英格兰大学城市", mapScope: "不列颠与拉丁学术网络", note: "罗吉尔·培根、奥卡姆及方济各会经院传统的重要中心。" },
  ]),
  place("florence", "佛罗伦萨／意大利城邦", "Florence", "city", "意大利托斯卡纳大区", 43.7696, 11.2558, 10, [
    { period: "14—16 世纪", ancientOrPeriodName: "Firenze / Florentia", politicalContext: "商业共和国与美第奇权力中心", mapScope: "意大利城邦与地中海贸易", note: "文艺复兴人文主义、艺术赞助和现实政治研究的典型环境。" },
  ]),
  place("wittenberg", "维滕贝格", "Wittenberg", "city", "德国萨克森—安哈尔特州", 51.866, 12.648, 11, [
    { period: "16 世纪", ancientOrPeriodName: "Wittenberg", politicalContext: "萨克森选侯领大学城", mapScope: "神圣罗马帝国与北欧", note: "路德宗教改革和印刷论战的重要起点。" },
  ]),
  place("frombork", "弗龙堡／哥白尼活动区", "Frombork", "city", "波兰瓦尔米亚—马祖里省", 54.3577, 19.6803, 11, [
    { period: "16 世纪初", ancientOrPeriodName: "Frauenburg", politicalContext: "瓦尔米亚主教区", mapScope: "波罗的海、波兰与普鲁士", note: "哥白尼长期任职并完成天文学研究的地点。" },
  ]),
  place("padua", "帕多瓦", "Padua", "city", "意大利威尼托大区", 45.4064, 11.8768, 11, [
    { period: "16—17 世纪", ancientOrPeriodName: "Padova", politicalContext: "威尼斯共和国大学城市", mapScope: "北意大利与欧洲大学网络", note: "伽利略教学、实验和早期新科学发展的重要地点。" },
  ]),
  place("london", "伦敦／英格兰", "London", "city", "英国伦敦", 51.5074, -0.1278, 9, [
    { period: "17—19 世纪", ancientOrPeriodName: "London", politicalContext: "王权、议会、商业和科学机构中心", mapScope: "不列颠、北海与大西洋世界", note: "霍布斯、洛克、休谟影响史、皇家学会及工业政治思想的重要环境。" },
  ]),
  place("netherlands", "荷兰", "Dutch Republic / Netherlands", "region", "现代荷兰", 52.2, 5.3, 7, [
    { period: "17 世纪", ancientOrPeriodName: "Dutch Republic", politicalContext: "商业共和国与相对宽容的出版环境", mapScope: "低地国家、北海与欧洲贸易网络", note: "笛卡尔、斯宾诺莎和国际出版网络的重要环境。" },
  ]),
  place("geneva", "日内瓦", "Geneva", "city", "瑞士日内瓦州", 46.2044, 6.1432, 11, [
    { period: "16—18 世纪", ancientOrPeriodName: "Genève", politicalContext: "改革宗城市共和国", mapScope: "法国、瑞士与阿尔卑斯地区", note: "宗教改革传统和卢梭公民身份的地理背景。" },
  ]),
  place("konigsberg", "柯尼斯堡", "Königsberg / Kaliningrad", "city", "俄罗斯加里宁格勒", 54.7104, 20.4522, 10, [
    { period: "18 世纪", ancientOrPeriodName: "Königsberg", politicalContext: "普鲁士王国大学城市", mapScope: "波罗的海、普鲁士与德意志地区", note: "康德一生主要生活和教学的城市。" },
  ]),
  place("jena-berlin", "耶拿—柏林", "Jena / Berlin", "region", "德国中部与东北部", 51.6, 12.3, 7, [
    { period: "1790—1831", ancientOrPeriodName: "Jena and Berlin", politicalContext: "德意志大学、普鲁士国家与拿破仑战争环境", mapScope: "德意志诸邦与中欧", note: "德国观念论、浪漫主义和黑格尔哲学形成的主要区域。" },
  ]),
  place("trier-london", "特里尔—伦敦", "Trier / London", "region", "德国西部至英国", 50.7, 2.0, 6, [
    { period: "1818—1883", ancientOrPeriodName: "Trier, Paris, Brussels and London", politicalContext: "工业资本主义、革命与流亡政治网络", mapScope: "西欧工业城市", note: "马克思思想从莱茵地区、巴黎和布鲁塞尔转移至伦敦的地理路径。" },
  ]),
  place("united-states", "美国东北部与中西部", "United States", "region", "美国", 40.0, -90.0, 4, [
    { period: "19—20 世纪初", ancientOrPeriodName: "United States", politicalContext: "工业化、民主教育和专业大学扩张", mapScope: "北美与跨大西洋学术网络", note: "威廉·詹姆斯在哈佛、杜威在芝加哥与纽约发展实用主义。" },
  ]),
];

export const geographyById = new Map(geographyEntries.map((entry) => [entry.id, entry]));

const explicitAliases: Record<string, string[]> = {
  pella: ["佩拉", "马其顿"],
  hippo: ["希波", "北非"],
  antioch: ["安条克", "东地中海"],
  aachen: ["亚琛", "法兰克宫廷"],
  cordoba: ["科尔多瓦", "安达卢西亚"],
  florence: ["佛罗伦萨", "意大利城邦"],
  frombork: ["弗龙堡"],
  london: ["伦敦", "英格兰"],
  "jena-berlin": ["耶拿", "柏林"],
  "trier-london": ["特里尔"],
  "united-states": ["美国"],
};

export const geographyByAlias = new Map<string, GeographyEntry>();

geographyEntries.forEach((entry) => {
  const aliases = [
    entry.nameZh,
    ...entry.nameZh.split(/[／—]/),
    ...(explicitAliases[entry.id] || []),
  ].map((alias) => alias.trim()).filter((alias) => alias.length >= 2);

  aliases.forEach((alias) => {
    if (!geographyByAlias.has(alias)) geographyByAlias.set(alias, entry);
  });
});

export const geographyMatchers = [...geographyByAlias.keys()].sort((a, b) => b.length - a.length);
