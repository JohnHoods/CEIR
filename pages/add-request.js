import { useState } from "react";
import axios from "axios";
import withAuth from "../hoc/withAuth";

function AddRequest() {
  const [form, setForm] = useState({
    Title: "",
    category: "Нефтепродукты",
    requestPrice: "",
    currencyRequest: "USD",
    volumeRequest: "",
    dateRequest: "",
    paymentRequest: "Постоплата",
  });
  const [msg, setMsg] = useState("");

  const categories = ["Нефтепродукты", "Уголь", "Металлы", "Прочее"];
  const currencies = ["USD", "EUR", "RUB"];
  const payments = ["Постоплата", "Предоплата"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwt");
      const userId = localStorage.getItem("userId");
      if (!token || !userId) return setMsg("Войдите для размещения запроса");

      const dataToSend = {
        ...form,
        users_permissions_user: userId
      };

      await axios.post(
        "https://committed-purpose-bfc9c6671d.strapiapp.com/api/request-products",
        { data: dataToSend },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg("Запрос успешно добавлен!");
      setForm({
        Title: "",
        category: "Нефтепродукты",
        requestPrice: "",
        currencyRequest: "USD",
        volumeRequest: "",
        dateRequest: "",
        paymentRequest: "Постоплата",
      });
    } catch (err) {
      setMsg(
        "Ошибка при добавлении запроса: " +
        (err.response?.data?.error?.message || "Неизвестная ошибка")
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      maxWidth: 600,
      margin: "40px auto",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      background: "#fff",
      borderRadius: 12,
      padding: 32,
      boxShadow: "0 4px 20px #d5d5d5",
    }}>
      {/* поля как у тебя */}
      <input name="Title" value={form.Title} onChange={handleChange} placeholder="Название запроса" required />
      <select name="category" value={form.category} onChange={handleChange}>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <input name="requestPrice" value={form.requestPrice} onChange={handleChange} placeholder="Желаемая цена" type="number" min="0" required />
      <select name="currencyRequest" value={form.currencyRequest} onChange={handleChange}>
        {currencies.map((cur) => (
          <option key={cur} value={cur}>{cur}</option>
        ))}
      </select>
      <input name="volumeRequest" value={form.volumeRequest} onChange={handleChange} placeholder="Требуемый объем" type="number" min="0" step="any" required />
      <input name="dateRequest" value={form.dateRequest} onChange={handleChange} placeholder="Требуемая дата" type="date" required />
      <select name="paymentRequest" value={form.paymentRequest} onChange={handleChange}>
        {payments.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
      <button type="submit">Разместить запрос</button>
      <div>{msg}</div>
    </form>
  );
}

export default withAuth(AddRequest);