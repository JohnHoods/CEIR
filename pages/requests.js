import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { API_URL } from "../utils/api";

export default function Requests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/request-products`)
      .then(res => {
        // Если res.data.data нет — значит массив плоский, иначе используй res.data.data
        const arr = res.data.data ?? res.data;
        setRequests(arr);
      })
      .catch(() => setRequests([]));
  }, []);

  console.log("requests from API:", requests);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <h2>Запросы на товары</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
        {requests.map((item) => {
          if (!item || !item.Title) {
            console.warn('Некорректный элемент:', item);
            return null;
          }
          return (
            <div key={item.id} style={{
              border: "1px solid #eee",
              borderRadius: 12,
              background: "#fafbff",
              boxShadow: "0 2px 8px #e5e9f2",
              padding: 20,
              minHeight: 180
            }}>
              <b>{item.Title}</b>
              <div>Категория: {item.category}</div>
              <div>Цена: {item.requestPrice} {item.currencyRequest}</div>
              <div>Требуемый объем: {item.volumeRequest}</div>
              <div>Дата: {item.dateRequest}</div>
              <div>Оплата: {item.paymentRequest}</div>
              <Link href={`/requests/${item.id}`} style={{
                color: "#2D69FD", marginTop: 8, display: "inline-block"
              }}>Подробнее</Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
