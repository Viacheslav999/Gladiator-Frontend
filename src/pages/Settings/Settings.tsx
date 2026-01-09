import React, { useState } from "react";
import "./settings.css";

type Language = "ru" | "en";

export default function Settings() {
  const [tab, setTab] = useState<
    "general" | "sound" | "finance" | "security" | "history"
  >("general");

  const [language, setLanguage] = useState<Language>("ru");
  const [theme, setTheme] = useState<"dark" | "auto">("dark");

  const [volume, setVolume] = useState(70);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [battleSound, setBattleSound] = useState(true);
  const [rewardSound, setRewardSound] = useState(true);
  const [notifySound, setNotifySound] = useState(true);

  const [autoGLD, setAutoGLD] = useState(false);
  const [autoLUCK, setAutoLUCK] = useState(false);
  const [autoREF, setAutoREF] = useState(false);

  return (
    <div className="settings-arena">

      {/* HEADER */}
      <div className="settings-header">
        ⚙️ Настройки
      </div>

      {/* TABS */}
      <nav className="settings-tabs">
        <button onClick={() => setTab("general")} className={tab==="general"?"active":""}>🌍 Общие</button>
        <button onClick={() => setTab("sound")} className={tab==="sound"?"active":""}>🔊 Звук</button>
        <button onClick={() => setTab("finance")} className={tab==="finance"?"active":""}>💰 Финансы</button>
        <button onClick={() => setTab("security")} className={tab==="security"?"active":""}>🔐 Безопасность</button>
        <button onClick={() => setTab("history")} className={tab==="history"?"active":""}>📊 История</button>
      </nav>

      <div className="settings-content">

        {/* ===== GENERAL ===== */}
        {tab === "general" && (
          <section className="settings-panel">
            <h3>🌍 Общие</h3>

            <div className="setting-row">
              <span>Язык</span>
              <select value={language} onChange={e => setLanguage(e.target.value as Language)}>
                <option value="ru">Русский</option>
                <option value="en">English</option>
              </select>
            </div>

            <div className="setting-row">
              <span>Тема</span>
              <select value={theme} onChange={e => setTheme(e.target.value as any)}>
                <option value="dark">Тёмная</option>
                <option value="auto">Авто (Telegram)</option>
              </select>
            </div>
          </section>
        )}

        {/* ===== SOUND ===== */}
        {tab === "sound" && (
          <section className="settings-panel">
            <h3>🔊 Звук</h3>

            <div className="setting-row">
              <span>Включить звук</span>
              <input type="checkbox" checked={soundEnabled} onChange={() => setSoundEnabled(!soundEnabled)} />
            </div>

            <div className="setting-row">
              <span>Громкость</span>
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                disabled={!soundEnabled}
                onChange={e => setVolume(Number(e.target.value))}
              />
            </div>

            <div className="setting-row">
              <span>Звуки боя</span>
              <input type="checkbox" disabled={!soundEnabled} checked={battleSound} onChange={()=>setBattleSound(!battleSound)} />
            </div>

            <div className="setting-row">
              <span>Звуки наград</span>
              <input type="checkbox" disabled={!soundEnabled} checked={rewardSound} onChange={()=>setRewardSound(!rewardSound)} />
            </div>

            <div className="setting-row">
              <span>Уведомления</span>
              <input type="checkbox" disabled={!soundEnabled} checked={notifySound} onChange={()=>setNotifySound(!notifySound)} />
            </div>
          </section>
        )}

        {/* ===== FINANCE ===== */}
        {tab === "finance" && (
          <section className="settings-panel">
            <h3>💰 Финансы</h3>

            <div className="setting-row">
              <span>Автообмен GLD → AUR</span>
              <input type="checkbox" checked={autoGLD} onChange={()=>setAutoGLD(!autoGLD)} />
            </div>

            <div className="setting-row">
              <span>Автообмен LUCK → AUR</span>
              <input type="checkbox" checked={autoLUCK} onChange={()=>setAutoLUCK(!autoLUCK)} />
            </div>

            <div className="setting-row">
              <span>Автообмен REF → AUR</span>
              <input type="checkbox" checked={autoREF} onChange={()=>setAutoREF(!autoREF)} />
            </div>

            <div className="settings-info">
              <div>Минимальный вывод: <b>10 AUR</b></div>
              <div>Комиссия вывода: <b>5%</b></div>
              <div>Время обработки: <b>до 24 часов</b></div>
            </div>
          </section>
        )}

        {/* ===== SECURITY ===== */}
        {tab === "security" && (
          <section className="settings-panel">
            <h3>🔐 Безопасность</h3>

            <div className="settings-info">
              <div>Telegram ID: <b>readonly</b></div>
              <div>Привязанный кошелёк: <b>TON / EVM</b></div>
              <div>Подтверждение вывода: <b>Telegram</b></div>
              <div>Задержка вывода: <b>24 часа</b></div>
            </div>
          </section>
        )}

        {/* ===== HISTORY ===== */}
        {tab === "history" && (
          <section className="settings-panel">
            <h3>📊 История</h3>
            <div className="settings-placeholder">
              История операций появится здесь
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
