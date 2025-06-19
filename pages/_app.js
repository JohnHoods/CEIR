import Head from "next/head";
import Layout from "../components/Layout";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* Подключаем Montserrat с Google Fonts */}
        <link href="https://fonts.googleapis.com/css2?family=CeraPro:wght@400;600&display=swap" rel="stylesheet" />
        {/* Глобальный стиль для font-family */}
        <style>{`
          body {
            font-family: 'Montserrat', Arial, sans-serif;
          }
        `}</style>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
