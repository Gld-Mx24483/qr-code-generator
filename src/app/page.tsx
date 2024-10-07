
import { Analytics } from '@vercel/analytics/react';
import QRCodeGenerator from "../app/components/index";

export default function Home() {
  return (
    <>
      <Analytics />
      <QRCodeGenerator />
    </>
  );
}
