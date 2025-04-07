const coins = [
    { id: "bitcoin", name: "Bitcoin" },
    { id: "ethereum", name: "Ethereum" },
    { id: "solana", name: "Solana" },
    { id: "cardano", name: "Cardano" },
    { id: "ripple", name: "Ripple (XRP)" },
    { id: "dogecoin", name: "Dogecoin" },
    { id: "polkadot", name: "Polkadot" },
    { id: "litecoin", name: "Litecoin" },
    // ... ajoute-en autant que tu veux
  ];
  
  const CryptoSelect = ({ selected, onChange }) => (
    <div className="flex justify-center mb-4">
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-800 text-white p-2 rounded shadow"
      >
        {coins.map((coin) => (
          <option key={coin.id} value={coin.id}>
            {coin.name}
          </option>
        ))}
      </select>
    </div>
  );
  
  export default CryptoSelect;
  