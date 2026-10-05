import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

const CheckoutModal = ({ isOpen, onClose, onSuccess, amount }) => {
  const [phoneNumber, setPhoneNumber] = useState('254');
  const [status, setStatus] = useState('idle'); // idle, processing, success, error
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (phoneNumber.length < 10) {
      setErrorMessage('Please enter a valid M-Pesa number');
      return;
    }

    setErrorMessage('');
    setStatus('processing');

    // Simulate STK Push delay (wait 4 seconds for user to "enter PIN")
    setTimeout(() => {
      setStatus('success');
      
      // Wait 1.5 seconds to show success before triggering booking creation
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }, 4000);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content mpesa-modal">
        <button className="modal-close" onClick={onClose} disabled={status === 'processing'}>
          &times;
        </button>

        <div className="mpesa-header">
          <div className="mpesa-logo-placeholder">
            <span className="mpesa-text-green">M-</span><span className="mpesa-text-red">PESA</span>
          </div>
          <h2>Lipa na M-Pesa</h2>
          <p className="mpesa-amount">Amount: KES {amount}</p>
        </div>

        {status === 'idle' || status === 'error' ? (
          <form onSubmit={handleSubmit} className="mpesa-form">
            <div className="form-group">
              <label>M-Pesa Phone Number</label>
              <div className="mpesa-input-wrapper">
                <span className="mpesa-prefix">📞</span>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="2547XXXXXXXX"
                  className="form-input mpesa-input"
                  required
                />
              </div>
              <small className="mpesa-help">Format: 2547XXXXXXXX or 2541XXXXXXXX</small>
            </div>

            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <button type="submit" className="btn btn-primary mpesa-btn">
              Send STK Push
            </button>
          </form>
        ) : null}

        {status === 'processing' && (
          <div className="mpesa-processing">
            <LoadingSpinner />
            <h3>Waiting for Payment</h3>
            <p>Please check your phone and enter your M-Pesa PIN to confirm the payment of <strong>KES {amount}</strong>.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="mpesa-success">
            <div className="success-checkmark">✓</div>
            <h3>Payment Received!</h3>
            <p>Transaction successful. Finalizing your booking...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
