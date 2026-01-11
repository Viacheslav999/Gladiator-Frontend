export type Rarity = "common" | "rare" | "epic" | "legendary";

export type SetItem = {
  slot: "head" | "body" | "legs" | "weapon" | "offhand";
  name: string;
  icon: string;
  stats: string;
};

export type GladiatorSet = {
  id: string;
  name: string;
  rarity: Rarity;
  description: string;
  priceGold: number | null;
  priceAur: number | null;
  items: SetItem[];
  bonuses: string[];
};

export const gladiatorSets: GladiatorSet[] = [
  {
    id: "samnis",
    name: "Самнит",
    rarity: "common",
    description:
      "Тяжёлый гладиатор ранней республики, облачённый по образцу самнитских воинов.",
    priceGold: 2500,
    priceAur: null,
    items: [
      {
        slot: "head",
        name: "Шлем Самнита",
        icon: "/icons/samnis/helmet.png",
        stats: "+4% защита",
      },
      {
        slot: "body",
        name: "Щит Scutum",
        icon: "/icons/samnis/scutum.png",
        stats: "+6% защита",
      },
      {
        slot: "legs",
        name: "Поножи Самнита",
        icon: "/icons/samnis/greaves.png",
        stats: "+4% здоровье",
      },
      {
        slot: "weapon",
        name: "Гладиус",
        icon: "/icons/samnis/gladius.png",
        stats: "+4% урон",
      },
    ],
    bonuses: ["2/4 → +3% здоровье", "4/4 → +5% защита"],
  },

  {
    id: "murmillo",
    name: "Мурмиллон",
    rarity: "rare",
    description:
      "Классический гладиатор с массивным щитом и шлемом с гребнем в форме рыбы.",
    priceGold: 12000,
    priceAur: 0.5,
    items: [
      {
        slot: "head",
        name: "Шлем Мурмиллона",
        icon: "/icons/murmillo/helmet.png",
        stats: "+7% защита",
      },
      {
        slot: "body",
        name: "Щит Scutum",
        icon: "/icons/murmillo/scutum.png",
        stats: "+10% защита",
      },
      {
        slot: "legs",
        name: "Поножи",
        icon: "/icons/murmillo/greaves.png",
        stats: "+6% здоровье",
      },
      {
        slot: "weapon",
        name: "Гладиус",
        icon: "/icons/murmillo/gladius.png",
        stats: "+6% урон",
      },
    ],
    bonuses: ["2/4 → +5% здоровье", "4/4 → +10% защита"],
  },

  {
    id: "thraex",
    name: "Фракиец",
    rarity: "epic",
    description:
      "Быстрый гладиатор с изогнутым клинком, происходящий от фракийских воинов.",
    priceGold: 45000,
    priceAur: 1.5,
    items: [
      {
        slot: "head",
        name: "Фракийский шлем",
        icon: "/icons/thraex/helmet.png",
        stats: "+8% защита",
      },
      {
        slot: "offhand",
        name: "Щит Parmula",
        icon: "/icons/thraex/parmula.png",
        stats: "+5% защита",
      },
      {
        slot: "legs",
        name: "Высокие поножи",
        icon: "/icons/thraex/greaves.png",
        stats: "+8% здоровье",
      },
      {
        slot: "weapon",
        name: "Сика",
        icon: "/icons/thraex/sica.png",
        stats: "+12% урон",
      },
    ],
    bonuses: [
      "2/4 → +8% урон",
      "3/4 → +5% шанс крита",
      "4/4 → +15% урон",
    ],
  },

  {
    id: "retiarius",
    name: "Ретиарий",
    rarity: "epic",
    description:
      "Лёгкий гладиатор без шлема, полагающийся на ловкость, сеть и трезубец.",
    priceGold: 50000,
    priceAur: 1.8,
    items: [
      {
        slot: "body",
        name: "Галерус",
        icon: "/icons/retiarius/galerus.png",
        stats: "+6% защита",
      },
      {
        slot: "weapon",
        name: "Трезубец",
        icon: "/icons/retiarius/trident.png",
        stats: "+10% урон",
      },
      {
        slot: "offhand",
        name: "Сеть",
        icon: "/icons/retiarius/net.png",
        stats: "+10% контроль",
      },
      {
        slot: "weapon",
        name: "Кинжал",
        icon: "/icons/retiarius/dagger.png",
        stats: "+5% скорость атаки",
      },
    ],
    bonuses: ["2/4 → +10% скорость", "4/4 → +15% уклонение"],
  },

  {
    id: "secutor",
    name: "Секутор",
    rarity: "legendary",
    description:
      "Преследователь ретиариев с гладким шлемом, созданным для боя против сетей.",
    priceGold: 120000,
    priceAur: 3,
    items: [
      {
        slot: "head",
        name: "Шлем Секутора",
        icon: "/icons/secutor/helmet.png",
        stats: "+12% защита",
      },
      {
        slot: "body",
        name: "Щит Scutum",
        icon: "/icons/secutor/scutum.png",
        stats: "+14% защита",
      },
      {
        slot: "legs",
        name: "Поножи",
        icon: "/icons/secutor/greaves.png",
        stats: "+10% здоровье",
      },
      {
        slot: "weapon",
        name: "Гладиус",
        icon: "/icons/secutor/gladius.png",
        stats: "+12% урон",
      },
    ],
    bonuses: [
      "2/4 → +10% сопротивление контролю",
      "4/4 → +20% урон, +10% здоровье",
    ],
  },
];
