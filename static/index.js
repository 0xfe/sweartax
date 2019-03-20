function randomString(len) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < len; i += 1) text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

// eslint-disable-next-line
function init({ el, onLoad, onPay }) {
  let APIKEY = 'kt-1IM9D9MUON4147OAKK5KYO7263IFE2NY'; // ks-CBX74QJJBPTJ21N4AGS3I0NXGFKD5B39
  let BASEURL = 'http://localhost:3000';

  // eslint-disable-next-line
  if (!SCREWU) {
    APIKEY = 'kp-VSF4788KAEXW95YDNP1WKG3A9CPD2IC0';
    BASEURL = 'https://app.quid.works';
  }
  // eslint-disable-next-line
  const q = new quid.Quid({
    apiKey: APIKEY,
    baseURL: BASEURL,
    onLoad,
  });
  q.install();

  el.addEventListener('click', () => {
    const elem = el;
    elem.style.display = 'none';
    q.requestPayment({
      productID: 'I-SWORE',
      productURL: window.location.origin,
      productName: 'You said a boo boo',
      productDescription: 'Earnings from your lack of restraint are donated to chraity.',
      requestID: randomString(10),
      price: 0.1,
      currency: 'CAD',
      errorCallback: (code) => {
        elem.style.display = 'block';
        console.log('QUID error:', code);
      },
      successCallback: (receipt) => {
        elem.style.display = 'block';
        onPay(receipt);
      },
    });
  });
}
