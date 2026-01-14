import React, { useState } from 'react';
import { useNotification } from './NotificationContext';
import './KunuMasaRestaurant.css';

interface Order {
  id: number;
  item: string;
  quantity: number;
}

const menu = [
  { name: 'Kunu', price: 300 },
  { name: 'Masa', price: 200 }
];

function KunuMasaRestaurant() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState('Kunu');
  const [quantity, setQuantity] = useState(1);
  const { showNotification } = useNotification();

  const addOrder = () => {
    if (!selected || quantity < 1) return;
    setOrders([
      ...orders,
      { id: orders.length + 1, item: selected, quantity }
    ]);
    setQuantity(1);
    showNotification(`${quantity} x ${selected} added to order!`);
  };

  const total = orders.reduce((sum, o) => {
    const price = menu.find(m => m.name === o.item)?.price || 0;
    return sum + price * o.quantity;
  }, 0);

  return (
    <div className="kunu-masa-restaurant">
      <h2>Kunu & Masa Restaurant</h2>
      <div className="menu-section">
        <label>Menu:</label>
        <select value={selected} onChange={e => setSelected(e.target.value)}>
          {menu.map(m => (
            <option key={m.name} value={m.name}>{m.name} (₦{m.price})</option>
          ))}
        </select>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={e => setQuantity(Number(e.target.value))}
        />
        <button onClick={addOrder}>Add to Order</button>
      </div>
      <div className="orders-section">
        <h3>Your Order</h3>
        {orders.length === 0 && <p>No items ordered yet.</p>}
        <ul>
          {orders.map(order => (
            <li key={order.id}>{order.quantity} x {order.item}</li>
          ))}
        </ul>
        <div className="total">Total: ₦{total}</div>
      </div>
    </div>
  );
}

export default KunuMasaRestaurant;
