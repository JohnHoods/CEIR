import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Layout({ children }) {
  const [isLogged, setIsLogged] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const pathname = typeof window !== "undefined" ? window.location.pathname : "";
    setIsLogged(!!localStorage.getItem("jwt"));
  }, [router.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setIsLogged(false);
    router.push("/login");
  };

  return (
    <div>
      <nav style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 32px', background: '#1A2233', color: '#fff', marginBottom: 32, borderRadius: 0}}>
        <div style={{ display: 'flex', gap: 24, fontSize: 15 }}>
          <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 700 }}>Маркетплейс</Link>
          <Link href="/products" style={{ color: '#fff', textDecoration: 'none' }}>Товары</Link>
          <Link href="/requests" style={{ color: '#fff', textDecoration: 'none' }}>Запросы</Link>
          <Link href="/add-product" style={{ color: '#fff', textDecoration: 'none' }}>Добавить товар</Link>
          <Link href="/add-request" style={{ color: '#fff', textDecoration: 'none' }}>Создать запрос</Link>
        </div>
        <div>
          {isLogged ? (
            <>
              <Link href="/cabinet" style={{
                color: '#fff', background: '#2D69FD', padding: '8px 20px', borderRadius: 8,
                textDecoration: 'none', fontWeight: 100, marginRight: 16
              }}>Личный кабинет</Link>
              <button onClick={handleLogout} style={{
                background: '#e24646', color: '#fff', border: 'none', borderRadius: 8,
                padding: '8px 16px', fontWeight: 100, cursor: 'pointer'
              }}>Выйти</button>
            </>
          ) : (
            <Link href="/login" style={{
              color: '#fff', background: '#2D69FD', padding: '8px 20px', borderRadius: 8,
              textDecoration: 'none', fontWeight: 600
            }}>Войти</Link>
          )}
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
