import React, { useState, useEffect } from 'react';
import './index.css';

const denominations = [20, 10, 5, 2, 1];

//cid = cash in drawer

const CashRegister = () => {
  const [total, setTotal] = useState(0);
  const [cid, setCid] = useState(denominations.map(denomination => [denomination, 0]));
  const [requestedChange, setRequestedChange] = useState(0);

  useEffect(() => {
    // Update available moneys string whenever cid changes
    const availableMoneysString = cid.map(([denomination, value]) => `${value}x$${denomination}`).join(' ');
    setAvailableMoneysString(availableMoneysString);
  }, [cid]);

  const [availableMoneysString, setAvailableMoneysString] = useState('');

  const addMoney = (denomination, amount) => {
    const updatedCid = cid.map(([d, value]) => [d, value + (d === denomination ? amount : 0)]);
    setCid(updatedCid);
    setTotal(prevTotal => prevTotal + amount * denomination);
  };

  const removeMoney = (denomination, amount) => {
    const updatedCid = cid.map(([d, value]) => [d, value - (d === denomination ? amount : 0)]);
    setCid(updatedCid);
    setTotal(prevTotal => prevTotal - amount * denomination);
  };

  const resetTotal = () => {
    setTotal(0);
    setCid(denominations.map(denomination => [denomination, 0]));
  };

  const dispenseChange = amount => {
    const change = [];
    let remainingChange = amount;

    // Calculate change using available denominations
    for (const [denomination, value] of cid) {
      const count = Math.min(Math.floor(remainingChange / denomination), value);
      if (count > 0) {
        change.push([denomination, count]);
        remainingChange -= count * denomination;
      }
    }

    // If remainingChange is not zero, there is not enough change in the register
    if (remainingChange !== 0) {
      alert('Unable to dispense change with available denominations. Not enough change in the register.');
      return;
    }

    // Update register and total
    const updatedCid = cid.map(([denomination, value]) => {
      const count = change.find(([d]) => d === denomination)?.[1] || 0;
      return [denomination, value - count];
    });

    setCid(updatedCid);
    setTotal(prevTotal => prevTotal - amount);
    alert('Change dispensed successfully!');
  };

  const handleInputChange = event => {
    setRequestedChange(parseFloat(event.target.value) || 0);
  };

  const requestChange = () => {
    dispenseChange(requestedChange);
  };

  return (
    <div>
      <h1>Cash Register</h1>
      <div className="total-section">
        <div className="total-label">Total:</div>
        <div className="total-amount">${total.toFixed(2)}</div>
      </div>
      <div className="available-moneys">{availableMoneysString}</div>
      <div className="buttons">
        {denominations.map(denomination => (
          <div key={denomination} className="denomination">
            <button onClick={() => addMoney(denomination, 1)}>Add {denomination}</button>
            <button onClick={() => removeMoney(denomination, 1)}>Remove {denomination}</button>
          </div>
        ))}
        <button onClick={resetTotal}>Reset Total</button>
      </div>
      <div className="dispense-section">
        <input type="number" value={requestedChange} onChange={handleInputChange} />
        <button className='request-total' onClick={requestChange}>Request Change</button>
      </div>
    </div>
  );
};

export default CashRegister;
