import ContactItem from "./ContactItem";
import styles from "./ContactsList.module.css";

function ContactsList({
  contacts,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onEdit,
  onDelete,
  totalCount,
  searchActive,
}) {
  const allSelected =
    contacts.length > 0 && contacts.every((c) => selectedIds.includes(c.id));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>
          📋 Contacts
          <span className={styles.count}>
            {searchActive ? `${contacts.length} of ${totalCount}` : totalCount}
          </span>
        </h3>

        {contacts.length > 0 && (
          <label className={styles.selectAll}>
            <input
              type="checkbox"
              checked={allSelected}
              onChange={() => onToggleSelectAll(contacts)}
            />
            <span>Select all</span>
          </label>
        )}
      </div>

      {contacts.length === 0 ? (
        <div className={styles.empty}>
          {searchActive ? "No items found." : "No contacts yet."}
        </div>
      ) : (
        <ul className={styles.list}>
          {contacts.map((contact) => (
            <ContactItem
              key={contact.id}
              data={contact}
              isSelected={selectedIds.includes(contact.id)}
              onToggleSelect={onToggleSelect}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default ContactsList;
