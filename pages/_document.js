import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=CeraPro:wght@400;600&display=swap" rel="stylesheet" />
        <style>{`
          body {
            font-family: 'Montserrat', Arial, sans-serif;
          }
        `}</style>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
