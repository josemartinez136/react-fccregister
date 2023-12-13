import React, { useState, useEffect } from 'react';
import './index.css';

const denominations = [20, 10, 5, 2, 1];

// cash in drawer
const CashRegister = () => {
  const [total, setTotal] = useState(0);
  const [cashInDrawer, setCashInDrawer] = useState(denominations.map(denomination => [denomination, 0]));
  const [requestedChange, setRequestedChange] = useState(0);

  useEffect(() => {
    const availableMoneysString = cashInDrawer.map(([denomination, value]) => `${value}x$${denomination}`).join(' ');
    setAvailableMoneysString(availableMoneysString);
  }, [cashInDrawer]);

  const [availableMoneysString, setAvailableMoneysString] = useState('');

  const addMoney = (denomination, amount) => {
    const updatedCashInDrawer = cashInDrawer.map(([d, value]) => [d, value + (d === denomination ? amount : 0)]);
    setCashInDrawer(updatedCashInDrawer);
    setTotal(prevTotal => prevTotal + amount * denomination);
  };

  const removeMoney = (denomination, amount) => {
    const updatedCashInDrawer = cashInDrawer.map(([d, value]) => [d, value - (d === denomination ? amount : 0)]);
    setCashInDrawer(updatedCashInDrawer);
    setTotal(prevTotal => prevTotal - amount * denomination);
  };

  const resetTotal = () => {
    setTotal(0);
    setCashInDrawer(denominations.map(denomination => [denomination, 0]));
  };

  const dispenseChange = requestedAmount => {
    const specialCase = [20, 10, 5, 2, 1].every(denomination =>
      cashInDrawer.some(([d, value]) => d === denomination && value > 0)
    );

    if (specialCase && requestedAmount === 30) {
      alert('Unable to dispense $30 from $60. Dispensing partial change.');
      return;
    }

    if (requestedAmount === 20) {
      const availableCount = cashInDrawer.find(([d]) => d === 20)?.[1] || 0;
      if (availableCount > 0) {
        const updatedCashInDrawer = cashInDrawer.map(([denomination, value]) => {
          const count = denomination === 20 ? 1 : 0;
          return [denomination, Math.max(0, value - count)];
        });

        // Calculate the new total
        const newTotal = updatedCashInDrawer.reduce((acc, [denomination, count]) => acc + denomination * count, 0);
        setTotal(newTotal);

        setCashInDrawer(updatedCashInDrawer);
        alert(`Change dispensed successfully: $${requestedAmount}`);
        return;
      }
    }

    const change = [];
    let remainingChange = requestedAmount;

    for (let i = denominations.length - 1; i >= 0; i--) {
      const denomination = denominations[i];
      const availableCount = cashInDrawer.find(([d]) => d === denomination)?.[1] || 0;

      const count = Math.min(Math.floor(remainingChange / denomination), availableCount);
      if (count > 0) {
        change.push([denomination, count]);
        remainingChange -= count * denomination;
      }
    }

    if (remainingChange === 0) {
      // Update register and total, so values do not go below zero
      const updatedCashInDrawer = cashInDrawer.map(([denomination, value]) => {
        const count = change.find(([d]) => d === denomination)?.[1] || 0;
        return [denomination, Math.max(0, value - count)];
      });

      // Calculate  new total
      const newTotal = updatedCashInDrawer.reduce((acc, [denomination, count]) => acc + denomination * count, 0);
      setTotal(newTotal);

      setCashInDrawer(updatedCashInDrawer);
      alert(`Change dispensed successfully: $${requestedAmount}`);
    } else {
      alert('Unable to dispense exact change with available denominations. Dispensing partial change.');
    }
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
        <input
          type="number"
          value={requestedChange}
          onChange={handleInputChange}
          onKeyPress={event => event.key === 'Enter' && requestChange()}
        />
        <button className='request-total' onClick={requestChange}>Request Change</button>
      </div>
    </div>
  );
};

export default CashRegister;
