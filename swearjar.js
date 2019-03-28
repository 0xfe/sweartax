/* global jsSocials, quid */

import { JarBuilder } from './pennyjarjs';
import * as H from './helpers';

class SwearJar {
  constructor(params) {
    H.log('Initializing SwearJar with', params);
    this.params = params;
    this.jarBuilder = new JarBuilder({ baseURL: params.baseURL });
    this.jar = null;

    this.spinnerEl = params.spinnerEl;
    this.errorEl = params.errorEl;
    this.amountEl = params.amountEl;

    this.newJarViewEl = params.newJarViewEl;
    this.inFlightSpinners = 0;
  }

  showSpinner() {
    this.inFlightSpinners += 1;
    H.log('In-flight spinners:', this.inFlightSpinners);
    this.spinnerEl.style.display = 'block';
  }

  hideSpinner() {
    this.inFlightSpinners -= 1;
    H.log('In-flight spinners:', this.inFlightSpinners);
    if (this.inFlightSpinners <= 0) {
      this.spinnerEl.style.display = 'none';
    }
  }

  showError(message) {
    if (message && message !== '') {
      H.logError(message);
    }

    this.errorEl.innerText = message || '';
    this.errorEl.classList.remove('animate-beat');
    this.errorEl.classList.add('animate-beat');
  }

  resetJar() {
    this.jar = null;
    this.newJarViewEl.style.display = 'flex';
  }

  showNewJar(thejarEl, jar) {
    const el = thejarEl;
    el.style.display = 'block';
    this.jar = jar;
    this.amountEl.innerText = `$${this.jar.total.toFixed(2)}`;

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
  }

  load(params) {
    const { thejarEl, code } = params;
    this.showSpinner();
    this.jarBuilder
      .load(code)
      .then((jar) => {
        H.log('Found jar: ', jar);
        this.showNewJar(thejarEl, jar);
      })
      .catch((e) => {
        H.logError(e);
        this.newJarViewEl.style.display = 'flex';
        this.showError('Yikes! Trouble at home base.');
      })
      .finally(() => {
        this.hideSpinner();
      });
  }

  installNewButton(params) {
    const { newEl, thejarEl } = params;
    newEl.addEventListener('click', () => {
      this.newJarViewEl.style.display = 'none';
      this.showSpinner();
      this.jarBuilder
        .create()
        .then((jar) => {
          this.showNewJar(thejarEl, jar);
        })
        .catch((e) => {
          H.logError(e);
          this.newJarViewEl.style.display = 'flex';
          this.showError('Yikes! Trouble at home base.');
        })
        .finally(() => {
          this.hideSpinner();
        });
    });
  }

  installSwearButton(params) {
    const { swearEl, totalEl } = params;
    this.showSpinner();
    const q = new quid.Quid({
      apiKey: this.params.quidAPIKey,
      baseURL: this.params.quidBaseURL,
      onLoad: () => {
        this.hideSpinner();
        swearEl.style.display = 'block';
        totalEl.style.display = 'flex';
      },
    });
    q.install();

    swearEl.addEventListener('click', () => {
      swearEl.style.display = 'none';
      this.showSpinner();
      q.requestPayment({
        productID: 'SWEAR-00',
        productURL: window.location.origin,
        productName: 'You said a booboo!',
        productDescription: 'Earnings from your lack of restraint are donated to the EFF.',
        requestID: H.randomString(10),
        price: 0.1,
        currency: 'CAD',
        errorCallback: (code) => {
          this.hideSpinner();
          swearEl.style.display = 'block';
          H.log('QUID error:', code);
        },
        successCallback: (receipt) => {
          this.hideSpinner();
          swearEl.style.display = 'block';
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
        H.logError(e);
        this.showError('Yikes! Trouble at home base.');
      })
      .finally(() => {
        this.hideSpinner();
      });
  }
}

function run(SCREWU) {
  const BASE_URL = SCREWU ? 'http://localhost:8010/pennywall/us-central1' : null;
  const QUID_API_KEY = SCREWU
    ? 'kt-1IM9D9MUON4147OAKK5KYO7263IFE2NY' // ks-CBX74QJJBPTJ21N4AGS3I0NXGFKD5B39
    : 'kp-VSF4788KAEXW95YDNP1WKG3A9CPD2IC0';
  const QUID_BASE_URL = SCREWU ? 'http://localhost:3000' : 'https://app.quid.works';

  H.log(`Running Swearjar in ${SCREWU ? 'test' : 'live'} mode.`);

  const swearJar = new SwearJar({
    baseURL: BASE_URL,
    quidBaseURL: QUID_BASE_URL,
    quidAPIKey: QUID_API_KEY,
    spinnerEl: document.getElementById('spinner'),
    errorEl: document.getElementById('error'),
    amountEl: document.getElementById('amount'),
    newJarViewEl: document.getElementsByClassName('helljar')[0],
  });

  swearJar.installNewButton({
    newEl: document.getElementById('new'),
    codeEl: document.getElementById('code'),
    thejarEl: document.getElementsByClassName('thejar')[0],
  });

  const params = new URLSearchParams(window.location.search);
  if (params.has('code')) {
    H.log(`Looking up ${params.get('code')}...`);
    swearJar.load({
      thejarEl: document.getElementsByClassName('thejar')[0],
      code: params.get('code'),
    });
  } else {
    H.log('No code provided.');
    swearJar.resetJar();
  }

  swearJar.installSwearButton({
    swearEl: document.getElementById('swear'),
    totalEl: document.getElementById('total'),
  });
}

export default run;
