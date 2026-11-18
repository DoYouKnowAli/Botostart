import styles from "./ContactItem.module.css";

function ContactItem({
  data: { id, name, lastName, email, phoneNumber },
  isSelected,
  isExiting,
  style,
  onToggleSelect,
  onEdit,
  onDelete,
}) {
  return (
    <li
      style={style}
      className={`${styles.item} ${isSelected ? styles.selected : ""} ${isExiting ? styles.exiting : ""}`}
    >
      <label className={styles.checkbox}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(id)}
        />
      </label>

      <div className={styles.info}>
        <p className={styles.name}>
          {name} {lastName}
        </p>
        <p className={styles.detail}>
          <span>📧</span> {email}
        </p>
        <p className={styles.detail}>
          <span>📞</span> {phoneNumber}
        </p>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.editBtn}
          onClick={() => onEdit({ id, name, lastName, email, phoneNumber })}
          title="Edit"
        >
          ✏️
        </button>
        <button
          className={styles.deleteBtn}
          onClick={() => onDelete(id)}
          title="Delete"
        >
          🗑️
        </button>
      </div>
    </li>
  );
}

export default ContactItem;
