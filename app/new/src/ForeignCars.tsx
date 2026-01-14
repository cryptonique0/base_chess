import React, { useState } from 'react';
import './ForeignCars.css';

interface Car {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface Accessory {
  id: number;
  name: string;
  price: number;
}

const cars: Car[] = [
  { id: 1, name: 'Toyota Camry 2015', price: 4500000, image: 'https://via.placeholder.com/120x80?text=Camry' },
  { id: 2, name: 'Honda Accord 2017', price: 5200000, image: 'https://via.placeholder.com/120x80?text=Accord' },
  { id: 3, name: 'BMW X5 2014', price: 8500000, image: 'https://via.placeholder.com/120x80?text=BMW+X5' }
];

const accessories: Accessory[] = [
  { id: 1, name: 'Alloy Wheels', price: 120000 },
  { id: 2, name: 'Car Stereo', price: 35000 },
  { id: 3, name: 'Leather Seat Cover', price: 50000 }
];

function ForeignCars() {
  const [cart, setCart] = useState<{ name: string; price: number }[]>([]);

  const addToCart = (item: { name: string; price: number }) => {
    setCart([...cart, item]);
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="foreign-cars-app">
      <h2>Foreign Used Cars</h2>
      <div className="cars-section">
        <h3>Cars for Sale</h3>
        <div className="cars-list">
          {cars.map(car => (
            <div key={car.id} className="car-item">
              // eslint-disable-next-line @next/next/no-img-element
              <img src={car.image} alt={car.name} />
              <div>{car.name}</div>
              <div>₦{car.price.toLocaleString()}</div>
              <button onClick={() => addToCart({ name: car.name, price: car.price })}>Add to Cart</button>
            </div>
          ))}
        </div>
      </div>
      <div className="accessories-section">
        <h3>Car Accessories</h3>
        <div className="accessories-list">
          {accessories.map(acc => (
            <div key={acc.id} className="accessory-item">
              <div>{acc.name}</div>
              <div>₦{acc.price.toLocaleString()}</div>
              <button onClick={() => addToCart({ name: acc.name, price: acc.price })}>Add to Cart</button>
            </div>
          ))}
        </div>
      </div>
      <div className="cart-section">
        <h3>Cart</h3>
        {cart.length === 0 && <p>No items in cart.</p>}
        <ul>
          {cart.map((item, idx) => (
            <li key={idx}>{item.name} - ₦{item.price.toLocaleString()}</li>
          ))}
        </ul>
        <div className="total">Total: ₦{total.toLocaleString()}</div>
      </div>
    </div>
  );
}

export default ForeignCars;
