import { BsCurrencyExchange } from "react-icons/bs";

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <h1>
            <BsCurrencyExchange color="#add8e6" /> Crypto-Gold Tracker
          </h1>
          <p>Real-time gold & crypto currencies prices and market data</p>
        </div>
      </div>
    </header>
  );
}
export default Header;
