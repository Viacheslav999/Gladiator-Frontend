// ===== ЭКИПИРОВКА / РЫНОК =====

export type ItemRarity = "common" | "rare" | "epic" | "legendary";

export type EquipmentSlot =
  | "weapon"
  | "head"
  | "body"   // доспех (главный)
  | "hands"
  | "legs";

export type EquipmentItem = {
  id: string;
  slot: EquipmentSlot;
  level: number;          // уровень прокачки
  rarity: ItemRarity;     // редкость (для рынка / NFT)
};

export type Equipment = {
  weapon?: EquipmentItem;
  head?: EquipmentItem;
  body?: EquipmentItem;   // ← ДОСПЕХ
  hands?: EquipmentItem;
  legs?: EquipmentItem;
};

// ===== ГЛАДИАТОР =====

export type Gladiator = {
  id: string;
  name: string;
  image: string;

  // базовые статы
  hp: number;
  attack: number;
  defense: number;
  critChance: number;

  // экипировка (опционально, чтобы ничего не ломать)
  equipment?: Equipment;
};


