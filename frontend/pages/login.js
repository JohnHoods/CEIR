import { useState } from "react";
import { loginUser } from "../utils/api";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";

export default function Login() {
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginUser(form);
      localStorage.setItem("jwt", data.jwt);
      if (data.user && data.user.id) {
        localStorage.setItem("userId", data.user.id);
      }

      // Получаем company_name и verified после логина
      if (data.jwt) {
        const res = await axios.get("https://committed-purpose-bfc9c6671d.strapiapp.com/api/users/me", {
          headers: { Authorization: `Bearer ${data.jwt}` }
        });

        if (res.data && res.data.company_name) {
          localStorage.setItem("company_name", res.data.company_name);
        }

        // Проверка на verified
        if (res.data && res.data.verified !== undefined) {
          if (!res.data.verified) {
            setMsg("Ваш аккаунт не одобрен администратором. Ожидайте верификации.");
            return;
          }
        }
      }

      setMsg("Вход выполнен!");
      router.push("/cabinet");
    } catch (err) {
      setMsg("Ошибка входа: " + (err.response?.data?.error?.message || ""));
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      maxWidth: 400, margin: "80px auto", display: "flex", flexDirection: "column", gap: 16,
      background: "#fff", borderRadius: 12, padding: 32, boxShadow: "0 4px 20px #d5d5d5"
    }}>
      <input name="identifier" value={form.identifier} onChange={handleChange} placeholder="Email или логин" required />
      <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Пароль" required />
      <button type="submit">Войти</button>
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
        Новый пользователь? <Link href="/register">Зарегистрируйтесь</Link>
      </div>
    </form>
  );
}
