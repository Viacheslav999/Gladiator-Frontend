import React, { useState } from "react";
import "./exchange-arena.css";

/* =======================
   TYPES
======================= */

type TokenId =
  | "USDT" | "USDC" | "TON" | "BTC" | "ETH"
  | "BNB" | "TRX" | "SOL" | "LTC" | "MATIC"
  | "AUR" | "GLD" | "LUCK" | "REF";

type TokenGroup = "crypto" | "arena" | "game";

type Token = {
  id: TokenId;
  name: string;
  icon: string;
  group: TokenGroup;
  note: string;
};

/* =======================
   TOKENS
======================= */

const TOKENS: Token[] = [
  { id: "USDT", name: "USDT", icon: "🟩", group: "crypto", note: "Основная валюта" },
  { id: "USDC", name: "USDC", icon: "🔵", group: "crypto", note: "Стейблкоин" },
  { id: "TON", name: "TON", icon: "🔷", group: "crypto", note: "Сеть TON" },
  { id: "BTC", name: "Bitcoin", icon: "🟠", group: "crypto", note: "BTC" },
  { id: "ETH", name: "Ethereum", icon: "💎", group: "crypto", note: "ETH" },
  { id: "BNB", name: "BNB", icon: "🟡", group: "crypto", note: "Binance" },
  { id: "TRX", name: "TRON", icon: "🔴", group: "crypto", note: "TRX" },
  { id: "SOL", name: "Solana", icon: "🟣", group: "crypto", note: "SOL" },
  { id: "LTC", name: "Litecoin", icon: "⚪", group: "crypto", note: "LTC" },
  { id: "MATIC", name: "Polygon", icon: "🟪", group: "crypto", note: "MATIC" },

  { id: "AUR", name: "AUREUS", icon: "🏆", group: "arena", note: "Центр экономики" },

  { id: "GLD", name: "GLADIUS", icon: "⚔️", group: "game", note: "Бои и турниры" },
  { id: "LUCK", name: "LUCK", icon: "🍀", group: "game", note: "Бонусы удачи" },
  { id: "REF", name: "REF", icon: "🟣", group: "game", note: "Рефералы" },
];

/* =======================
   RATES → AUR
======================= */

const RATES: Record<TokenId, number> = {
  USDT: 1, USDC: 1, TON: 5.2, BTC: 42000, ETH: 2200,
  BNB: 310, TRX: 0.12, SOL: 95, LTC: 70, MATIC: 0.9,
  GLD: 0.001, LUCK: 0.01, REF: 0.1,
  AUR: 1,
};

/* =======================
   MOCK ADDRESSES
   (потом уйдёт в backend)
======================= */

const DEPOSIT_ADDRESSES: Record<TokenId, string> = {
  USDT: "0xUSDT_DEPOSIT_ADDRESS",
  USDC: "0xUSDC_DEPOSIT_ADDRESS",
  TON: "EQC_TON_ADDRESS",
  BTC: "bc1BTCADDRESS",
  ETH: "0xETHADDRESS",
  BNB: "0xBNBADDRESS",
  TRX: "TRXADDRESS",
  SOL: "SOLADDRESS",
  LTC: "LTCADDRESS",
  MATIC: "0xMATICADDRESS",
  AUR: "", GLD: "", LUCK: "", REF: "",
};

/* =======================
   MAIN
======================= */

export default function ExchangeArena() {
  const [tab, setTab] = useState<"exchange" | "deposit" | "withdraw">("exchange");
  const [from, setFrom] = useState<TokenId>("GLD");
  const [amount, setAmount] = useState("");
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const [balances, setBalances] = useState<Record<TokenId, number>>({
    AUR: 28.36, GLD: 2440, LUCK: 12, REF: 3,
    USDT: 0, USDC: 0, TON: 0, BTC: 0, ETH: 0,
    BNB: 0, TRX: 0, SOL: 0, LTC: 0, MATIC: 0,
  });

  const amountNum = Number(amount) || 0;
  const aurResult = amountNum * RATES[from];
  const canExchange = amountNum > 0 && balances[from] >= amountNum;

  function doExchange() {
    if (!canExchange) return;
    setBalances(b => ({
      ...b,
      [from]: b[from] - amountNum,
      AUR: b.AUR + aurResult,
    }));
    setToast(`Получено ${aurResult.toFixed(2)} AUR`);
    setTimeout(() => setToast(null), 2200);
  }

  function doWithdraw() {
    if (amountNum <= 0 || amountNum > balances.AUR || !withdrawAddress) return;
    const received = amountNum * 0.95;
    setBalances(b => ({ ...b, AUR: b.AUR - amountNum }));
    setToast(`Вывод: ${received.toFixed(2)} AUR`);
    setTimeout(() => setToast(null), 2200);
  }

  const crypto = TOKENS.filter(t => t.group === "crypto");
  const game = TOKENS.filter(t => t.group === "game");

  return (
    <div className="arena">

      {/* USER BAR */}
      <div className="user-bar">
        <div>👤 Gladiator • 🏆 Уровень 7</div>
        <div className="user-balances">
          <span>🏆 {balances.AUR.toFixed(2)}</span>
          <span>⚔️ {balances.GLD}</span>
          <span>🍀 {balances.LUCK}</span>
          <span>🟣 {balances.REF}</span>
        </div>
      </div>

      {/* TABS */}
      <nav className="tabs">
        <button className={`pill ${tab==="exchange"?"pill--active":""}`} onClick={()=>setTab("exchange")}>⚖️ Обмен</button>
        <button className={`pill ${tab==="deposit"?"pill--active":""}`} onClick={()=>setTab("deposit")}>➕ Пополнение</button>
        <button className={`pill ${tab==="withdraw"?"pill--active":""}`} onClick={()=>setTab("withdraw")}>➖ Вывод</button>
      </nav>

      <div className="exchange-scroll">

        {/* ===== EXCHANGE ===== */}
        {tab === "exchange" && (
          <div className="exchange-columns">
            <section className="panel">
              <h3>⚔️ Игровые валюты</h3>
              {game.map(t => (
                <div key={t.id} className={`token-row ${from===t.id?"active":""}`} onClick={()=>setFrom(t.id)}>
                  <span>{t.icon}</span><div>{t.name}</div>
                </div>
              ))}
            </section>

            <section className="panel panel-arena">
              <h3>🏆 AUREUS</h3>
              <div className="exchange-visual">{from} ➜ AUR</div>
              <input className="amount-input" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Количество" />
              <div className="panel-hint">Получишь: {aurResult.toFixed(2)} AUR</div>
              <button className="arena-action" disabled={!canExchange} onClick={doExchange}>⚔️ Обменять</button>
            </section>

            <section className="panel">
              <h3>💰 Криптовалюты</h3>
              <p className="panel-hint">Через вывод</p>
            </section>
          </div>
        )}

        {/* ===== DEPOSIT ===== */}
        {tab === "deposit" && (
          <section className="panel panel-arena">
            <h3>➕ Пополнение AUR</h3>
            {crypto.map(t => (
              <div key={t.id} className={`token-row ${from===t.id?"active":""}`} onClick={()=>setFrom(t.id)}>
                <span>{t.icon}</span><div>{t.name}</div>
              </div>
            ))}

            {DEPOSIT_ADDRESSES[from] && (
              <>
                <div className="panel-hint">Адрес для {from}</div>
                <div className="wallet-address">{DEPOSIT_ADDRESSES[from]}</div>
              </>
            )}
          </section>
        )}

        {/* ===== WITHDRAW ===== */}
        {tab === "withdraw" && (
          <section className="panel panel-arena">
            <h3>➖ Вывод AUR</h3>
            {crypto.map(t => (
              <div key={t.id} className={`token-row ${from===t.id?"active":""}`} onClick={()=>setFrom(t.id)}>
                <span>{t.icon}</span><div>{t.name}</div>
              </div>
            ))}

            <input className="amount-input" placeholder="Сумма AUR" value={amount} onChange={e=>setAmount(e.target.value)} />
            <input className="amount-input" placeholder="Адрес получателя" value={withdrawAddress} onChange={e=>setWithdrawAddress(e.target.value)} />
            <div className="panel-hint">Комиссия 5%</div>
            <button className="arena-action" onClick={doWithdraw}>💸 Вывести</button>
          </section>
        )}

      </div>

      {toast && (
        <div className="success-overlay">
          <div className="success-text">{toast}</div>
        </div>
      )}
    </div>
  );
}
