import { useState, useEffect } from "react";
import axios from "axios";
import withAuth from "../hoc/withAuth";

function Cabinet() {
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState("");
  const [myProducts, setMyProducts] = useState([]);
  const [myRequests, setMyRequests] = useState([]);

  // Получаем профиль пользователя
useEffect(() => {
  const token = localStorage.getItem("jwt");
  if (token) {
    axios.get("https://committed-purpose-bfc9c6671d.strapiapp.com/api/users/me", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setUser(res.data);
      setForm(res.data);
      // Получаем товары (author_seller)
      axios.get(`https://committed-purpose-bfc9c6671d.strapiapp.com/api/products?filters[author_seller][id][$eq]=${res.data.id}`)
        .then(r => setMyProducts(r.data.data ?? r.data))
        .catch(() => setMyProducts([]));
      // Получаем запросы (author_buyer)
      axios.get(`https://committed-purpose-bfc9c6671d.strapiapp.com/api/request-products?filters[author_buyer][id][$eq]=${res.data.id}`)
        .then(r => setMyRequests(r.data.data ?? r.data))
        .catch(() => setMyRequests([]));
    });
  }
}, []);

  // Обработка изменения полей формы
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Сохранение профиля
  const handleSave = async (e) => {
    e.preventDefault();
    setMsg("Сохраняем...");
    const token = localStorage.getItem("jwt");
    try {
      await axios.put(
        `https://committed-purpose-bfc9c6671d.strapiapp.com/api/users/${user.id}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg("Изменения сохранены!");
      setEdit(false);
    } catch (err) {
      setMsg("Ошибка сохранения: " + (err.response?.data?.error?.message || ""));
    }
  };

  if (!user) return <div style={{textAlign: "center", marginTop: 50}}>Загрузка профиля...</div>;

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", textAlign: "center" }}>
      <h2>Личный кабинет</h2>
      {edit ? (
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center", marginBottom: 24 }}>
          <input name="username" value={form.username || ""} onChange={handleChange} placeholder="Логин" required />
          <input name="email" value={form.email || ""} onChange={handleChange} placeholder="Email" required />
          <input name="company_name" value={form.company_name || ""} onChange={handleChange} placeholder="Компания" />
          <input name="contact_person" value={form.contact_person || ""} onChange={handleChange} placeholder="Контактное лицо" />
          <input name="phone" value={form.phone || ""} onChange={handleChange} placeholder="Телефон" />
          <button type="submit">Сохранить</button>
          <button type="button" onClick={() => setEdit(false)}>Отмена</button>
        </form>
      ) : (
        <>
          <div style={{marginBottom: 16}}>
            <b>Логин:</b> {user.username} <br/>
            <b>Email:</b> {user.email} <br/>
            {user.company_name && <><b>Компания:</b> {user.company_name} <br/></>}
            {user.contact_person && <><b>Контактное лицо:</b> {user.contact_person} <br/></>}
            {user.phone && <><b>Телефон:</b> {user.phone} <br/></>}
          </div>
          <button onClick={() => setEdit(true)}>Редактировать профиль</button>
        </>
      )}
      <div style={{color: "#2d69fd", margin: 12}}>{msg}</div>

      <hr style={{margin: "32px 0"}} />

      <h3>Мои товары</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 40 }}>
        {myProducts.length === 0 && <div style={{gridColumn: "1/4"}}>Нет товаров</div>}
        {myProducts.map(item => {
          const p = item.attributes ?? item; // под разные форматы
          return (
            <div key={item.id} style={{
              border: "1px solid #eee",
              borderRadius: 10,
              background: "#fafbff",
              padding: 16
            }}>
              <b>{p.Name}</b>
              <div>Категория: {p.category}</div>
              <div>Цена: {p.price} {p.currency}</div>
            </div>
          );
        })}
      </div>

      <h3>Мои запросы</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {myRequests.length === 0 && <div style={{gridColumn: "1/4"}}>Нет запросов</div>}
        {myRequests.map(item => {
          const r = item.attributes ?? item;
          return (
            <div key={item.id} style={{
              border: "1px solid #eee",
              borderRadius: 10,
              background: "#fafbff",
              padding: 16
            }}>
              <b>{r.Title}</b>
              <div>Категория: {r.category}</div>
              <div>Объем: {r.volumeRequest}</div>
              <div>Цена: {r.requestPrice} {r.currencyRequest}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default withAuth(Cabinet);
