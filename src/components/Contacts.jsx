import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import inputs from "../constants/inputs.js";
import ContactsList from "./ContactsList";
import Modal from "./Modal";
import styles from "./Contacts.module.css";

const emptyContact = {
  id: "",
  name: "",
  lastName: "",
  email: "",
  phoneNumber: "",
};

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [contact, setContact] = useState(emptyContact);
  const [errors, setErrors] = useState({});
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  const [modal, setModal] = useState({
    open: false,
    type: null,
    payload: null,
  });

  const validate = () => {
    const newErrors = {};

    if (!contact.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!contact.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!contact.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!contact.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else {
      const cleaned = contact.phoneNumber.replace(/[\s\-()]/g, "");
      if (!/^\+?\d{7,15}$/.test(cleaned)) {
        newErrors.phoneNumber = "Enter a valid phone (e.g. +989123456789)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const changeHandler = (event) => {
    const { name, value } = event.target;
    setContact((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const openSaveModal = () => {
    if (!validate()) return;

    setModal({
      open: true,
      type: "save",
      payload: null,
    });
  };

  const confirmSave = () => {
    const cleaned = {
      ...contact,
      name: contact.name.trim(),
      lastName: contact.lastName.trim(),
      email: contact.email.trim(),
      phoneNumber: contact.phoneNumber.trim(),
    };

    if (editId) {
      setContacts((prev) =>
        prev.map((c) => (c.id === editId ? { ...cleaned, id: editId } : c)),
      );
    } else {
      const newContact = { ...cleaned, id: uuidv4() };
      setContacts((prev) => [...prev, newContact]);
    }

    resetForm();
    closeModal();
  };

  const startEdit = (contactToEdit) => {
    setContact({ ...contactToEdit });
    setEditId(contactToEdit.id);
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    resetForm();
  };

  const resetForm = () => {
    setContact(emptyContact);
    setEditId(null);
    setErrors({});
  };

  const openDeleteOneModal = (id) => {
    setModal({
      open: true,
      type: "delete-one",
      payload: id,
    });
  };

  const confirmDeleteOne = () => {
    setContacts((prev) => prev.filter((c) => c.id !== modal.payload));
    setSelectedIds((prev) => prev.filter((id) => id !== modal.payload));
    closeModal();
  };

  const openDeleteManyModal = () => {
    if (selectedIds.length === 0) return;
    setModal({
      open: true,
      type: "delete-many",
      payload: null,
    });
  };

  const confirmDeleteMany = () => {
    setContacts((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
    setSelectedIds([]);
    closeModal();
  };

  const closeModal = () => {
    setModal({ open: false, type: null, payload: null });
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = (filteredContacts) => {
    const filteredIds = filteredContacts.map((c) => c.id);
    const allSelected = filteredIds.every((id) => selectedIds.includes(id));

    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...filteredIds])]);
    }
  };

  const filteredContacts = contacts.filter((c) => {
    const term = search.toLowerCase().trim();
    if (!term) return true;

    const name = (c.name || "").toLowerCase().trim();
    const lastName = (c.lastName || "").toLowerCase().trim();
    const email = (c.email || "").toLowerCase().trim();
    const fullName = `${name} ${lastName}`.trim();

    return (
      name.includes(term) ||
      lastName.includes(term) ||
      fullName.includes(term) ||
      email.includes(term)
    );
  });

  const getModalContent = () => {
    switch (modal.type) {
      case "delete-one":
        return {
          title: "Delete contact?",
          message: "This contact will be permanently removed.",
          confirmText: "Delete",
          isDanger: true,
          onConfirm: confirmDeleteOne,
        };
      case "delete-many":
        return {
          title: "Delete selected contacts?",
          message: `You are about to delete ${selectedIds.length} contact(s). This cannot be undone.`,
          confirmText: "Delete all",
          isDanger: true,
          onConfirm: confirmDeleteMany,
        };
      case "save":
        return {
          title: editId ? "Update contact?" : "Add contact?",
          message: editId
            ? "Do you want to save the changes?"
            : "Do you want to add this new contact?",
          confirmText: editId ? "Update" : "Add",
          isDanger: false,
          onConfirm: confirmSave,
        };
      default:
        return null;
    }
  };

  const modalContent = getModalContent();

  return (
    <div className={styles.container}>
      {}
      <div className={styles.formCard}>
        <h2 className={styles.formTitle}>
          {editId ? "Edit contact" : "📲 Add your contacts"}
        </h2>

        <div className={styles.form}>
          {inputs.map((input) => (
            <div key={input.name} className={styles.field}>
              <input
                type={input.type}
                name={input.name}
                placeholder={input.placeholder}
                autoComplete={input.autoComplete}
                value={contact[input.name]}
                onChange={changeHandler}
                className={errors[input.name] ? styles.inputError : ""}
              />
              {errors[input.name] && (
                <span className={styles.errorText}>{errors[input.name]}</span>
              )}
            </div>
          ))}
        </div>

        <div className={styles.formActions}>
          <button className={styles.primaryBtn} onClick={openSaveModal}>
            {editId ? "Update" : "Add contact"}
          </button>
          {editId && (
            <button className={styles.secondaryBtn} onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </div>

      {}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search by name, last name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {selectedIds.length > 0 && (
          <button
            className={styles.bulkDeleteBtn}
            onClick={openDeleteManyModal}
          >
            Delete selected ({selectedIds.length})
          </button>
        )}
      </div>

      {}
      <ContactsList
        contacts={filteredContacts}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
        onToggleSelectAll={toggleSelectAll}
        onEdit={startEdit}
        onDelete={openDeleteOneModal}
        totalCount={contacts.length}
        searchActive={search.trim().length > 0}
      />

      {}
      {modal.open && modalContent && (
        <Modal
          title={modalContent.title}
          message={modalContent.message}
          confirmText={modalContent.confirmText}
          isDanger={modalContent.isDanger}
          onConfirm={modalContent.onConfirm}
          onCancel={closeModal}
        />
      )}
    </div>
  );
}

export default Contacts;
