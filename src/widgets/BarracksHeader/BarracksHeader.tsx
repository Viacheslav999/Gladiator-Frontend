import styles from "./BarracksHeader.module.css";

export default function BarracksHeader() {
  return (
    <div className={styles.header}>
      <div className={styles.left}>
        <div className={styles.avatar} />
        <div>
          <div className={styles.level}>Lv. 90</div>
          <div className={styles.exp}>
            <span />
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.resource}>⚡ 120</div>
        <div className={styles.resource}>🪙 73.7m</div>
        <div className={styles.resource}>🏆 10230</div>
      </div>
    </div>
  );
}
