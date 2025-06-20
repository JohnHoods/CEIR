import { useState } from "react";
import axios from "axios";
import withAuth from "../hoc/withAuth";
import { API_URL } from "../utils/api";

function AddProduct() {
  const [form, setForm] = useState({
    Name: "",
    category: "нефтепродукты",
    price: "",
    currency: "USD",
    min_order: "",
    delivery_date: "",
    delivery_terms: "EXW",
    payment: "постоплата",
    documents: [],
  });
  const [msg, setMsg] = useState("");

  const categories = ["нефтепродукты", "уголь", "металлы", "прочее"];
  const currencies = ["USD", "EUR", "RUB"];
  const delivery_terms_options = ["EXW", "FCA", "CPT", "CIP", "DAP", "DPU", "DDP"];
  const payments = ["постоплата", "предоплата"];

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    if (type === "file") {
      setForm((prev) => ({
        ...prev,
        [name]: Array.from(files),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwt");
      const userId = localStorage.getItem("userId");
      const companyName = localStorage.getItem("company_name");
      if (!token || !userId) return setMsg("Войдите для добавления товара");

      const formData = new FormData();
      // Документы
      if (form.documents.length) {
        form.documents.forEach((file) =>
          formData.append("files.documents", file)
        );
      }
      // Остальные поля
      [
        "Name",
        "category",
        "price",
        "currency",
        "min_order",
        "delivery_date",
        "delivery_terms",
        "payment",
      ].forEach((key) => {
        if (form[key]) {
          formData.append(`data[${key}]`, form[key].toString());
        }
      });

      // company_name сразу в продукт
      if (companyName) {
        formData.append("data[company_name]", companyName);
      }
      // Связь с пользователем
      formData.append("data[users_permissions_user]", userId);

      await axios.post(`${API_URL}/products`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMsg("Товар успешно добавлен!");
      setForm({
        Name: "",
        category: "нефтепродукты",
        price: "",
        currency: "USD",
        min_order: "",
        delivery_date: "",
        delivery_terms: "EXW",
        payment: "постоплата",
        documents: [],
      });
    } catch (err) {
      setMsg(
        "Ошибка при добавлении товара: " +
        (err?.response?.data?.error?.message || "Неизвестная ошибка")
      );
      console.log("Ошибка при добавлении товара:", err?.response?.data);
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
      <input
        name="Name"
        value={form.Name}
        onChange={handleChange}
        placeholder="Название товара"
        required
      />
      <select name="category" value={form.category} onChange={handleChange} required>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat[0].toUpperCase() + cat.slice(1)}</option>
        ))}
      </select>
      <input
        name="price"
        value={form.price}
        onChange={handleChange}
        placeholder="Цена"
        required
        type="number"
        min="0"
      />
      <select name="currency" value={form.currency} onChange={handleChange} required>
        {currencies.map((cur) => (
          <option key={cur} value={cur}>{cur}</option>
        ))}
      </select>
      <input
        name="min_order"
        value={form.min_order}
        onChange={handleChange}
        placeholder="Минимальный объём заказа"
        required
        type="number"
        min="0"
        step="any"
      />
      <input
        name="delivery_date"
        value={form.delivery_date}
        onChange={handleChange}
        placeholder="Дата поставки"
        required
        type="date"
      />
      <select
        name="delivery_terms"
        value={form.delivery_terms}
        onChange={handleChange}
        required
      >
        {delivery_terms_options.map((term) => (
          <option key={term} value={term}>{term}</option>
        ))}
      </select>
      <select name="payment" value={form.payment} onChange={handleChange} required>
        {payments.map((pay) => (
          <option key={pay} value={pay}>{pay}</option>
        ))}
      </select>
      <input
        name="documents"
        type="file"
        onChange={handleChange}
        required
        multiple
        accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt"
      />
      <button type="submit">Разместить товар</button>
      <div>{msg}</div>
    </form>
  );
}

export default withAuth(AddProduct);
