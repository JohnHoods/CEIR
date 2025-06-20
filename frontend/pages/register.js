import { useState } from "react";
import { registerUser, updateUser } from "../utils/api";
import Link from "next/link";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    company_name: "",
    tax_id: "",
    legal_address: "",
    contact_person: "",
    contact_position: "",
    work_email: "",
    phone: "",
    country: "",
    registration_number: "",
    bank_details: "",
    account_role: "buyer"
  });
  const [msg, setMsg] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Регистрируем пользователя (core поля)
      const { data } = await registerUser({
        username: form.username,
        email: form.email,
        password: form.password,
      });

      // 2. Обновляем кастомные поля через PUT /users/:id
      await updateUser(
        data.user.id,
        {
          company_name: form.company_name,
          tax_id: form.tax_id,
          legal_address: form.legal_address,
          contact_person: form.contact_person,
          contact_position: form.contact_position,
          work_email: form.work_email,
          phone: form.phone,
          country: form.country,
          registration_number: form.registration_number,
          bank_details: form.bank_details,
          account_role: form.account_role,
        },
        data.jwt
      );
      setMsg("Регистрация успешна! Ожидайте одобрения.");
    } catch (err) {
      setMsg(
        "Ошибка регистрации: " +
          (err.response?.data?.error?.message || "Неизвестная ошибка")
      );
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 600,
        margin: "40px auto",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        background: "#fff",
        borderRadius: 12,
        padding: 32,
        boxShadow: "0 4px 20px #d5d5d5",
      }}
    >
      <input name="username" value={form.username} onChange={handleChange} placeholder="Логин" required />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email для входа" required />
      <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Пароль" required />
      <input name="company_name" value={form.company_name} onChange={handleChange} placeholder="Название компании" required />
      <input name="tax_id" value={form.tax_id} onChange={handleChange} placeholder="ИНН / EIN / аналог" required />
      <input name="legal_address" value={form.legal_address} onChange={handleChange} placeholder="Юр. адрес" required />
      <input name="contact_person" value={form.contact_person} onChange={handleChange} placeholder="Контактное лицо (ФИО)" required />
      <input name="contact_position" value={form.contact_position} onChange={handleChange} placeholder="Должность контактного лица" required />
      <input name="work_email" value={form.work_email} onChange={handleChange} placeholder="Рабочий email" required />
      <input name="phone" value={form.phone} onChange={handleChange} placeholder="Телефон (с кодом страны)" required />
      <input name="country" value={form.country} onChange={handleChange} placeholder="Страна регистрации" required />
      <input name="registration_number" value={form.registration_number} onChange={handleChange} placeholder="ОГРН / рег. номер" />
      <textarea name="bank_details" value={form.bank_details} onChange={handleChange} placeholder="Банковские реквизиты" required />
      <select name="account_role" value={form.account_role} onChange={handleChange}>
        <option value="seller">Продавец</option>
        <option value="buyer">Покупатель</option>
        <option value="both">Оба</option>
      </select>
      <button type="submit">Зарегистрироваться</button>
      {msg && (
      <div
        style={{
          margin: "8px 0 0 0",
          color: msg.startsWith("Ошибка") ? "#e53935" : "#219653",
          fontWeight: 500,
          fontSize: 16
        }}
      >
        {msg}
      </div>
    )}
      <div style={{ marginTop: 12 }}>
        Уже зарегистрированы? <Link href="/login">Войти</Link>
      </div>
    </form>
  );
}
