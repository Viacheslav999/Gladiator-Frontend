import styles from "./Barracks.module.css";

export default function GladiatorSlot({
  gladiator,
  focused,
  onClick,
}: {
  gladiator: any;
  focused: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`${styles.gladiator} ${
        focused ? styles.focused : ""
      }`}
      onClick={!focused ? onClick : undefined}
    >
      {/* ИМЯ НАД ГОЛОВОЙ (ТОЛЬКО В КАЗАРМЕ) */}
      {!focused && (
        <div className={styles.nameAbove}>
          {gladiator.name}
        </div>
      )}

      <img src={gladiator.image} alt={gladiator.name} />

      {/* эффекты */}
      <div className={styles.glow} />
      <div className={styles.smoke} />
    </div>
  );
}
