export interface Ruler {
  name: string;
  title: string;
  yearStart: number;
  yearEnd: number;
  description: string;
  era: string;
}

export interface HistoryEvent {
  year: number;
  title: string;
  description: string;
  side: "left" | "right";
  category: "war" | "culture" | "politics" | "church" | "expansion" | "reform";
}

export const rulers: Ruler[] = [
  { name: "Рюрик", title: "Князь Новгородский", yearStart: 862, yearEnd: 879, description: "Основатель династии Рюриковичей", era: "Древняя Русь" },
  { name: "Олег Вещий", title: "Великий Князь", yearStart: 879, yearEnd: 912, description: "Объединил Новгород и Киев", era: "Древняя Русь" },
  { name: "Игорь", title: "Великий Князь", yearStart: 912, yearEnd: 945, description: "Походы на Константинополь", era: "Древняя Русь" },
  { name: "Ольга", title: "Великая Княгиня", yearStart: 945, yearEnd: 964, description: "Первая христианка среди правителей Руси", era: "Древняя Русь" },
  { name: "Святослав I", title: "Великий Князь", yearStart: 964, yearEnd: 972, description: "Великий полководец, завоеватель", era: "Древняя Русь" },
  { name: "Владимир I", title: "Великий Князь", yearStart: 980, yearEnd: 1015, description: "Крещение Руси в 988 году", era: "Древняя Русь" },
  { name: "Ярослав Мудрый", title: "Великий Князь", yearStart: 1019, yearEnd: 1054, description: "Расцвет Киевской Руси", era: "Древняя Русь" },
  { name: "Владимир Мономах", title: "Великий Князь", yearStart: 1113, yearEnd: 1125, description: "Объединение русских земель", era: "Древняя Русь" },
  { name: "Александр Невский", title: "Великий Князь", yearStart: 1252, yearEnd: 1263, description: "Победа над шведами и рыцарями", era: "Удельная Русь" },
  { name: "Иван I Калита", title: "Великий Князь", yearStart: 1325, yearEnd: 1340, description: "Возвышение Москвы", era: "Московское княжество" },
  { name: "Дмитрий Донской", title: "Великий Князь", yearStart: 1359, yearEnd: 1389, description: "Победа на Куликовом поле", era: "Московское княжество" },
  { name: "Иван III", title: "Государь всея Руси", yearStart: 1462, yearEnd: 1505, description: "Объединение русских земель вокруг Москвы", era: "Русское государство" },
  { name: "Василий III", title: "Государь всея Руси", yearStart: 1505, yearEnd: 1533, description: "Завершение объединения земель", era: "Русское государство" },
  { name: "Иван IV Грозный", title: "Царь", yearStart: 1547, yearEnd: 1584, description: "Первый царь, опричнина, завоевание Казани", era: "Царство Русское" },
  { name: "Борис Годунов", title: "Царь", yearStart: 1598, yearEnd: 1605, description: "Смутное время", era: "Царство Русское" },
  { name: "Михаил I Романов", title: "Царь", yearStart: 1613, yearEnd: 1645, description: "Основатель династии Романовых", era: "Царство Русское" },
  { name: "Алексей Михайлович", title: "Царь", yearStart: 1645, yearEnd: 1676, description: "Тишайший царь. Воссоединение с Украиной", era: "Царство Русское" },
  { name: "Пётр I Великий", title: "Царь, Император", yearStart: 1682, yearEnd: 1725, description: "Модернизация России, основание Петербурга", era: "Российская Империя" },
  { name: "Елизавета Петровна", title: "Императрица", yearStart: 1741, yearEnd: 1762, description: "Расцвет русской культуры", era: "Российская Империя" },
  { name: "Екатерина II Великая", title: "Императрица", yearStart: 1762, yearEnd: 1796, description: "Золотой век дворянства", era: "Российская Империя" },
  { name: "Александр I", title: "Император", yearStart: 1801, yearEnd: 1825, description: "Победа над Наполеоном", era: "Российская Империя" },
  { name: "Николай I", title: "Император", yearStart: 1825, yearEnd: 1855, description: "Эпоха реакции", era: "Российская Империя" },
  { name: "Александр II", title: "Император", yearStart: 1855, yearEnd: 1881, description: "Отмена крепостного права", era: "Российская Империя" },
  { name: "Александр III", title: "Император", yearStart: 1881, yearEnd: 1894, description: "Миротворец, контрреформы", era: "Российская Империя" },
  { name: "Николай II", title: "Император", yearStart: 1894, yearEnd: 1917, description: "Последний российский император", era: "Российская Империя" },
  { name: "В.И. Ленин", title: "Председатель СНК", yearStart: 1917, yearEnd: 1924, description: "Революция, образование СССР", era: "Советская Россия" },
  { name: "И.В. Сталин", title: "Генеральный Секретарь", yearStart: 1924, yearEnd: 1953, description: "Индустриализация, победа во ВМВ", era: "СССР" },
  { name: "Н.С. Хрущёв", title: "Первый Секретарь", yearStart: 1953, yearEnd: 1964, description: "Оттепель, космос", era: "СССР" },
  { name: "Л.И. Брежнев", title: "Генеральный Секретарь", yearStart: 1964, yearEnd: 1982, description: "Эпоха застоя", era: "СССР" },
  { name: "М.С. Горбачёв", title: "Президент СССР", yearStart: 1985, yearEnd: 1991, description: "Перестройка, распад СССР", era: "СССР" },
  { name: "Б.Н. Ельцин", title: "Президент России", yearStart: 1991, yearEnd: 1999, description: "Становление новой России", era: "Россия" },
  { name: "В.В. Путин", title: "Президент России", yearStart: 2000, yearEnd: 2026, description: "Современная Россия", era: "Россия" },
];

export const events: HistoryEvent[] = [
  // ── ЛЕВАЯ КОЛОНКА: война и политика ──
  { year: 862, title: "Призвание варягов", description: "Рюрик приглашён княжить в Новгород — начало русской государственности", side: "left", category: "politics" },
  { year: 882, title: "Захват Киева", description: "Олег объединяет Новгород и Киев, создавая Киевскую Русь", side: "left", category: "politics" },
  { year: 907, title: "Поход на Константинополь", description: "Олег прибивает щит на врата Царьграда и заключает выгодный торговый договор", side: "left", category: "war" },
  { year: 1147, title: "Основание Москвы", description: "Юрий Долгорукий упоминает Москву в летописях — начало будущей столицы", side: "left", category: "politics" },
  { year: 1237, title: "Нашествие Батыя", description: "Монголо-татарское нашествие на Русь, начало двухвекового ига", side: "left", category: "war" },
  { year: 1240, title: "Невская битва", description: "Александр Невский разгромил шведских рыцарей на берегах Невы", side: "left", category: "war" },
  { year: 1242, title: "Ледовое побоище", description: "Разгром Тевтонского ордена на льду Чудского озера", side: "left", category: "war" },
  { year: 1380, title: "Куликовская битва", description: "Дмитрий Донской победил Мамая — первая крупная победа над Ордой", side: "left", category: "war" },
  { year: 1480, title: "Конец татарского ига", description: "Великое стояние на реке Угре — освобождение от монгольского господства", side: "left", category: "politics" },
  { year: 1547, title: "Первый царь", description: "Иван IV венчается на царство — Россия становится царством", side: "left", category: "politics" },
  { year: 1552, title: "Взятие Казани", description: "Иван Грозный завоевал Казанское ханство, расширив Русь на Восток", side: "left", category: "war" },
  { year: 1598, title: "Смутное время", description: "Пресечение династии Рюриковичей, начало смуты и польской интервенции", side: "left", category: "politics" },
  { year: 1613, title: "Земский Собор", description: "Избрание Михаила Романова — начало 300-летней династии", side: "left", category: "politics" },
  { year: 1654, title: "Переяславская рада", description: "Воссоединение Украины с Россией", side: "left", category: "politics" },
  { year: 1703, title: "Основание Петербурга", description: "Пётр I основал новую столицу на берегах Невы — «окно в Европу»", side: "left", category: "politics" },
  { year: 1709, title: "Полтавская битва", description: "Разгром шведской армии Карла XII, Россия стала великой европейской державой", side: "left", category: "war" },
  { year: 1812, title: "Отечественная война", description: "Вторжение Наполеона, пожар Москвы, великое отступление и разгром французов", side: "left", category: "war" },
  { year: 1825, title: "Восстание декабристов", description: "Дворянское восстание на Сенатской площади за конституцию и свободу", side: "left", category: "politics" },
  { year: 1861, title: "Отмена крепостного права", description: "Александр II освободил 23 миллиона крестьян великой реформой", side: "left", category: "politics" },
  { year: 1904, title: "Русско-японская война", description: "Поражение России на Дальнем Востоке, гибель Тихоокеанской эскадры", side: "left", category: "war" },
  { year: 1905, title: "Первая революция", description: "Кровавое воскресенье, первая российская революция, манифест о свободах", side: "left", category: "politics" },
  { year: 1914, title: "Первая мировая война", description: "Россия вступила в войну, унёсшую миллионы жизней", side: "left", category: "war" },
  { year: 1917, title: "Великая революция", description: "Февральская и Октябрьская революции, конец империи, начало советской эпохи", side: "left", category: "politics" },
  { year: 1922, title: "Образование СССР", description: "Союз Советских Социалистических Республик торжественно провозглашён", side: "left", category: "politics" },
  { year: 1941, title: "Великая Отечественная война", description: "Нападение Германии, героическое сопротивление советского народа", side: "left", category: "war" },
  { year: 1945, title: "Победа над фашизмом", description: "Советский народ разгромил нацистскую Германию, 9 мая — День Победы", side: "left", category: "war" },
  { year: 1979, title: "Война в Афганистане", description: "Ввод советских войск в Афганистан, начало десятилетней войны", side: "left", category: "war" },
  { year: 1991, title: "Распад СССР", description: "Советский Союз прекратил существование, Россия обрела независимость", side: "left", category: "politics" },
  { year: 1994, title: "Первая чеченская война", description: "Федеральные войска вошли в Чечню, два года тяжёлых боёв", side: "left", category: "war" },
  { year: 2014, title: "Воссоединение с Крымом", description: "Крым вошёл в состав Российской Федерации по итогам референдума", side: "left", category: "politics" },
  { year: 2020, title: "Пандемия COVID-19", description: "Россия ввела режим самоизоляции. Закрыты границы, школы, предприятия. Миллионы россиян на карантине", side: "left", category: "politics" },
  { year: 2022, title: "Специальная военная операция", description: "Начало специальной военной операции на Украине", side: "left", category: "war" },

  // ── ПРАВАЯ КОЛОНКА: наука, культура, церковь, реформы ──
  { year: 988, title: "Крещение Руси", description: "Владимир I принял православие, Русь крестилась в Днепре — духовный поворот цивилизации", side: "right", category: "church" },
  { year: 1037, title: "Собор Святой Софии", description: "Ярослав Мудрый воздвиг Киево-Печерский монастырь и Собор Святой Софии в Киеве", side: "right", category: "culture" },
  { year: 1073, title: "Изборник Святослава", description: "Создана одна из первых крупных рукописных книг Киевской Руси — энциклопедия знаний эпохи", side: "right", category: "culture" },
  { year: 1564, title: "Первая печатная книга", description: "Иван Фёдоров напечатал «Апостол» — первую русскую датированную печатную книгу", side: "right", category: "culture" },
  { year: 1672, title: "Первый театр в России", description: "По указу царя Алексея Михайловича открылся первый придворный театр в Москве", side: "right", category: "culture" },
  { year: 1700, title: "Юлианский календарь", description: "Пётр I ввёл летоисчисление от Рождества Христова и новый год 1 января", side: "right", category: "reform" },
  { year: 1724, title: "Академия наук", description: "Пётр I основал Академию наук — центр российской науки на три века вперёд", side: "right", category: "reform" },
  { year: 1755, title: "Московский университет", description: "Ломоносов и Шувалов основали первый российский университет", side: "right", category: "culture" },
  { year: 1761, title: "Открытие атмосферы Венеры", description: "Михаил Ломоносов во время транзита Венеры открыл её атмосферу — первое планетарное открытие России", side: "right", category: "reform" },
  { year: 1799, title: "Батальная живопись Суворова", description: "Расцвет русского искусства: Академия художеств выпускает первых великих живописцев", side: "right", category: "culture" },
  { year: 1833, title: "Электрический двигатель", description: "Борис Якоби изобрёл первый пригодный для практики электродвигатель", side: "right", category: "reform" },
  { year: 1869, title: "Периодический закон", description: "Дмитрий Менделеев открыл периодический закон и создал таблицу химических элементов", side: "right", category: "reform" },
  { year: 1876, title: "Лампа накаливания Лодыгина", description: "Александр Лодыгин запатентовал электрическую лампу накаливания раньше Эдисона", side: "right", category: "reform" },
  { year: 1878, title: "Дуговой прожектор Яблочкова", description: "Павел Яблочков изобрёл «электрическую свечу» — первый практичный источник электрического света", side: "right", category: "reform" },
  { year: 1888, title: "Радио Попова", description: "Александр Попов продемонстрировал первый в мире радиоприёмник", side: "right", category: "reform" },
  { year: 1891, title: "Транссибирская магистраль", description: "Начало строительства величайшей железной дороги мира — от Москвы до Владивостока", side: "right", category: "reform" },
  { year: 1898, title: "Открытие иммунитета", description: "Илья Мечников разработал теорию клеточного иммунитета, Нобелевская премия 1908 года", side: "right", category: "reform" },
  { year: 1903, title: "Теория ракетного движения", description: "Константин Циолковский опубликовал труд об использовании ракет для полёта в космос", side: "right", category: "reform" },
  { year: 1913, title: "Первый самолёт «Илья Муромец»", description: "Игорь Сикорский построил первый в мире четырёхмоторный самолёт", side: "right", category: "reform" },
  { year: 1928, title: "Телевидение Зворыкина", description: "Владимир Зворыкин запатентовал иконоскоп — основу современного телевидения", side: "right", category: "reform" },
  { year: 1942, title: "Танк Т-34", description: "Массовое производство лучшего танка Второй мировой — символа советской инженерной мысли", side: "right", category: "reform" },
  { year: 1954, title: "Первая АЭС в мире", description: "В Обнинске запущена первая в мире атомная электростанция — прорыв советской науки", side: "right", category: "reform" },
  { year: 1957, title: "Первый спутник", description: "СССР запустил первый искусственный спутник Земли — начало космической эры", side: "right", category: "culture" },
  { year: 1961, title: "Полёт Гагарина", description: "Юрий Гагарин стал первым человеком в космосе — 108 минут, изменивших мир", side: "right", category: "culture" },
  { year: 1963, title: "Первая женщина в космосе", description: "Валентина Терешкова совершила 48 витков вокруг Земли на борту «Востока-6»", side: "right", category: "culture" },
  { year: 1965, title: "Выход в открытый космос", description: "Алексей Леонов первым в истории вышел в открытый космос — 12 минут за бортом", side: "right", category: "culture" },
  { year: 1986, title: "Авария на Чернобыле", description: "Взрыв на Чернобыльской АЭС — крупнейшая ядерная катастрофа в истории", side: "right", category: "reform" },
  { year: 1990, title: "Нобелевская премия Горбачёва", description: "Михаил Горбачёв получил Нобелевскую премию мира за окончание холодной войны", side: "right", category: "culture" },
  { year: 2006, title: "Сеть «ВКонтакте»", description: "Павел Дуров основал крупнейшую социальную сеть России и Восточной Европы", side: "right", category: "culture" },
  { year: 2010, title: "Сколково", description: "Создан инновационный центр Сколково — российская Кремниевая долина", side: "right", category: "reform" },
];

export const eras = [
  { name: "Древняя Русь", yearStart: 862, yearEnd: 1240, color: "#8B4513" },
  { name: "Удельная Русь & Монгольское иго", yearStart: 1240, yearEnd: 1480, color: "#6B3A2A" },
  { name: "Московское царство", yearStart: 1480, yearEnd: 1721, color: "#7A3B1E" },
  { name: "Российская Империя", yearStart: 1721, yearEnd: 1917, color: "#4A3728" },
  { name: "Советская Россия", yearStart: 1917, yearEnd: 1991, color: "#2C3E2D" },
  { name: "Россия", yearStart: 1991, yearEnd: 2026, color: "#1a2340" },
];