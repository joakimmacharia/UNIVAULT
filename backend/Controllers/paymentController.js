const getDarajaToken = async () => {
  const consumerKey = process.env.DARAJA_CONSUMER_KEY;
  const consumerSecret = process.env.DARAJA_CONSUMER_SECRET;
  
  // Use sandbox URL for testing; use production URL in production
  const url = process.env.DARAJA_ENV === 'production' 
    ? 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
    : 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  
  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${auth}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to get Daraja token');
  }
  
  const data = await response.json();
  return data.access_token;
};

const initiateSTKPush = async (req, res) => {
  try {
    const { phoneNumber, amount } = req.body;
    
    // Validate phone number format
    let formattedPhone = phoneNumber.replace(/[^0-9]/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.slice(1);
    } else if (formattedPhone.startsWith('7') || formattedPhone.startsWith('1')) {
      formattedPhone = '254' + formattedPhone;
    } else if (!formattedPhone.startsWith('254')) {
      return res.status(400).json({ success: false, message: 'Invalid phone number format' });
    }
    
    const token = await getDarajaToken();
    const shortcode = process.env.DARAJA_SHORTCODE;
    const passkey = process.env.DARAJA_PASSKEY;
    const callbackUrl = process.env.DARAJA_CALLBACK_URL; // Provide a public URL (e.g. ngrok) for local dev
    
    // Generate Timestamp (YYYYMMDDHHmmss)
    const date = new Date();
    const timestamp = date.getFullYear().toString() + 
      (date.getMonth() + 1).toString().padStart(2, '0') + 
      date.getDate().toString().padStart(2, '0') + 
      date.getHours().toString().padStart(2, '0') + 
      date.getMinutes().toString().padStart(2, '0') + 
      date.getSeconds().toString().padStart(2, '0');
      
    // Generate Password
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
    
    const stkUrl = process.env.DARAJA_ENV === 'production'
      ? 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
      : 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
    
    const payload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline', // or 'CustomerBuyGoodsOnline' for Till numbers
      Amount: Math.ceil(amount),
      PartyA: formattedPhone,
      PartyB: shortcode,
      PhoneNumber: formattedPhone,
      CallBackURL: callbackUrl,
      AccountReference: 'UniVault',
      TransactionDesc: 'Storage Booking Payment'
    };
    
    const response = await fetch(stkUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    
    if (data.ResponseCode === '0') {
      res.status(200).json({ success: true, message: 'STK push sent successfully', checkoutRequestID: data.CheckoutRequestID });
    } else {
      res.status(400).json({ success: false, message: 'Failed to initiate STK push', error: data });
    }
    
  } catch (error) {
    console.error('STK Push Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

const darajaCallback = async (req, res) => {
  console.log('Daraja Webhook Callback Received:');
  console.log(JSON.stringify(req.body, null, 2));
  
  // The callback contains the payment result
  const stkCallback = req.body?.Body?.stkCallback;
  
  if (stkCallback) {
    const resultCode = stkCallback.ResultCode;
    const merchantRequestID = stkCallback.MerchantRequestID;
    const checkoutRequestID = stkCallback.CheckoutRequestID;
    
    if (resultCode === 0) {
      // Payment was successful
      console.log(`Payment successful for request ${checkoutRequestID}`);
      // TODO: Update booking status in database to 'paid'
    } else {
      // Payment failed or was cancelled
      console.log(`Payment failed for request ${checkoutRequestID}: ${stkCallback.ResultDesc}`);
    }
  }
  
  // Acknowledge receipt
  res.status(200).json({ message: 'Callback received successfully' });
};

module.exports = {
  initiateSTKPush,
  darajaCallback
};
