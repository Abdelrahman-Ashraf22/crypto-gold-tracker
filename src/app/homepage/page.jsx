import Link from "next/link";
import { FaBitcoin } from "react-icons/fa";
import { GiGoldBar } from "react-icons/gi";
import Header from "../components/header";

export default function Homepage() {
  return (
    <div className="app">
      <Header />
      <h1>Home Page</h1>
      <div className="choose-option">
        <Link href="/cryptohome">
          <div className="kind-card">
            <FaBitcoin
              size={50}
              color="#f18d2b"
            />
            <h2>Crypto</h2>
          </div>
        </Link>

        <Link href="/goldhome">
          <div className="kind-card">
            <GiGoldBar
              color="#c3bb21ff"
              size={50}
            />
            <h2>Gold</h2>
          </div>
        </Link>
      </div>
    </div>
  );
}
