// Use test pennyjar
const BASE_URL = SCREWU ? 'http://localhost:8010/pennywall/us-central1' : null;
const QUID_API_KEY = SCREWU
  ? 'kt-1IM9D9MUON4147OAKK5KYO7263IFE2NY' // ks-CBX74QJJBPTJ21N4AGS3I0NXGFKD5B39
  : 'kp-VSF4788KAEXW95YDNP1WKG3A9CPD2IC0';
const QUID_BASE_URL = SCREWU ? 'http://localhost:3000' : 'https://app.quid.works';

function randomString(len) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < len; i += 1) text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

class SwearJar {
  constructor(params) {
    this.params = params;
    this.jarBuilder = new pennyjarjs.JarBuilder({ baseURL: params.baseURL });
    this.jar = null;

    this.spinnerEl = params.spinnerEl;
    this.errorEl = params.errorEl;
    this.amountEl = params.amountEl;
  }

  showSpinner() {
    this.spinnerEl.style.display = 'block';
  }

  hideSpinner() {
    this.spinnerEl.style.display = 'none';
  }

  showError(message) {
    if (message && message !== '') {
      console.error(message);
    }

    this.errorEl.innerText = message || '';
    this.errorEl.classList.remove('animate-beat');
    this.errorEl.classList.add('animate-beat');
  }

  installNewButton(params) {
    const { newEl, helljarEl, buttEl } = params;
    newEl.addEventListener('click', () => {
      helljarEl.style.display = 'none';
      this.showSpinner();
      this.jarBuilder
        .create()
        .then((jar) => {
          buttEl.style.display = 'block';
          this.jar = jar;
          window.history.pushState('object or string', 'This is our swear jar', `?code=${this.jar.code}`);
          // codeEl.innerText = this.jar.code;
          jsSocials.setDefaults('twitter', {
            logo: 'fab fa-twitter',
          });
          jsSocials.setDefaults('facebook', {
            logo: 'fab fa-facebook',
          });
          $('#shareIcons').jsSocials({
            showLabel: false,
            showCount: false,
            shares: ['email', 'twitter', 'facebook'],
          });
        })
        .catch((e) => {
          console.error(e);
          helljarEl.style.display = 'flex';
          this.showError('Yikes! Trouble at home base.');
        })
        .finally(() => {
          this.hideSpinner();
        });
    });
  }

  installSwearButton(params) {
    const { fuckEl, godEl } = params;
    // eslint-disable-next-line
    const q = new quid.Quid({
      apiKey: QUID_API_KEY,
      baseURL: QUID_BASE_URL,
      onLoad: () => {
        this.hideSpinner();
        fuckEl.style.display = 'block';
        godEl.style.display = 'flex';
      },
    });
    q.install();

    fuckEl.addEventListener('click', () => {
      fuckEl.style.display = 'none';
      q.requestPayment({
        productID: 'I-SWORE',
        productURL: window.location.origin,
        productName: 'You said a boo boo',
        productDescription: 'Earnings from your lack of restraint are donated to chraity.',
        requestID: randomString(10),
        price: 0.1,
        currency: 'CAD',
        errorCallback: (code) => {
          fuckEl.style.display = 'block';
          console.log('QUID error:', code);
        },
        successCallback: (receipt) => {
          fuckEl.style.display = 'block';
          this.onSwear(receipt);
        },
      });
    });
  }

  onSwear(receipt) {
    this.showSpinner();
    this.showError('');
    this.jar
      .donate('me', receipt)
      .then((resp) => {
        if (resp.success) {
          this.amountEl.innerText = `$${this.jar.total.toFixed(2)}`;
        } else {
          this.showError('Yikes! Trouble at home base.');
        }
      })
      .catch((e) => {
        console.error(e);
        this.showError('Yikes! Trouble at home base.');
      })
      .finally(() => {
        this.hideSpinner();
      });
  }
}

// eslint-disable-next-line
const swearJar = new SwearJar({
  baseURL: BASE_URL,
  spinnerEl: document.getElementById('spinner'),
  errorEl: document.getElementById('error'),
  amountEl: document.getElementById('amount'),
});

swearJar.installNewButton({
  newEl: document.getElementById('new'),
  helljarEl: document.getElementsByClassName('helljar')[0],
  codeEl: document.getElementById('code'),
  buttEl: document.getElementsByClassName('butt')[0],
});

swearJar.installSwearButton({
  fuckEl: document.getElementById('fuck'),
  godEl: document.getElementById('god'),
});
