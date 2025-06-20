import { useEffect, useState } from "react";
import axios from "axios";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [popupProduct, setPopupProduct] = useState(null);

  useEffect(() => {
    axios.get("https://committed-purpose-bfc9c6671d.strapiapp.com/api/products")
      .then(res => {
        const productsArray = res.data.data ?? res.data;
        setProducts(productsArray);
      })
      .catch(() => setProducts([]));
  }, []);

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <h2 style={{marginBottom: 32}}>Опубликованные товары</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {products.map((item) => {
          if (!item || !item.Name) return null;
          return (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 28,
                background: "#fafbff",
                borderRadius: 16,
                boxShadow: "0 2px 10px #e7eaf5",
                padding: 10,
                minHeight: 120,
                border: "1px solid #ececf3"
              }}
            >
              {/* Фото/филлер */}
              <div style={{
                width: 100,
                height: 100,
                borderRadius: 12,
                background: "linear-gradient(130deg,#dbeafe 40%,#e0e7ef 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 38,
                color: "#b8bed0",
                flexShrink: 0,
                marginRight: 8
              }}>
                <span>🖼️</span>
              </div>
              {/* Контент карточки */}
              <div style={{flex: 1, display: "flex", flexDirection: "column", minWidth: 0}}>
                <div style={{fontWeight: 700, fontSize: 21, marginBottom: 3, color: "#334155", lineHeight: 1.2}}>
                  {item.Name}
                </div>
                <div style={{fontSize: 15, color: "#7181a0", marginBottom: 13}}>
                  {item.category || "Без категории"}
                </div>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 18
                }}>
                  <div style={{
                    background: "#e5edfb",
                    color: "#1c325d",
                    fontWeight: 600,
                    borderRadius: 8,
                    fontSize: 18,
                    padding: "6px 18px 6px 12px",
                    letterSpacing: ".04em",
                    minWidth: 86
                  }}>
                    {item.price
                      ? `${item.price} ${item.currency || ""}`
                      : <span style={{color:"#b6b9be"}}>Цена не указана</span>}
                  </div>
                  <button
                    onClick={() => setPopupProduct(item)}
                    style={{
                      padding: "6px 24px",
                      borderRadius: 8,
                      border: "none",
                      background: "linear-gradient(90deg,#2563eb 60%,#0891b2 100%)",
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: 15,
                      cursor: "pointer",
                      boxShadow: "0 2px 8px #b4cdfc33",
                      letterSpacing: ".03em",
                      minWidth: 110
                    }}
                  >
                    Подробнее
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Попап с подробной информацией */}
      {popupProduct && (
        <div
          onClick={() => setPopupProduct(null)}
          style={{
            position: "fixed", zIndex: 9999, left: 0, top: 0, width: "100vw", height: "100vh",
            background: "rgba(30,35,50,0.42)", display: "flex", alignItems: "center", justifyContent: "center"
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "#fff", borderRadius: 18, boxShadow: "0 4px 32px #0002",
              minWidth: 380, maxWidth: 480, width: "90%",
              padding: "32px 24px 20px", position: "relative"
            }}
          >
            <button
              onClick={() => setPopupProduct(null)}
              style={{
                position: "absolute", right: 18, top: 12, fontSize: 22, border: "none",
                background: "none", color: "#999", cursor: "pointer"
              }}
              aria-label="Закрыть"
            >×</button>
            <h3 style={{ marginTop: 0, marginBottom: 16, fontWeight: 700 }}>{popupProduct.Name}</h3>
            <div>Категория: <b>{popupProduct.category}</b></div>
            <div>Цена: <b>{popupProduct.price} {popupProduct.currency}</b></div>
            <div>Минимальный заказ: {popupProduct.min_order}</div>
            <div>Дата поставки: {popupProduct.delivery_date}</div>
            <div>Условия поставки: {popupProduct.delivery_terms}</div>
            <div>Оплата: {popupProduct.payment}</div>
            <div style={{ marginTop: 12 }}>
              Продавец: <b>
                {popupProduct.company_name
                  ? popupProduct.company_name
                  : <span style={{ color: "#bbb" }}>Не указан</span>}
              </b>
            </div>
            {/* Документы, если есть */}
            {popupProduct.documents && Array.isArray(popupProduct.documents) && popupProduct.documents.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <b>Документы:</b>
                <ul>
                  {popupProduct.documents.map(doc => (
                    <li key={doc.id}>
                      <a
                        href={doc.url.startsWith("http") ? doc.url : `https://committed-purpose-bfc9c6671d.strapiapp.com${doc.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {doc.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
