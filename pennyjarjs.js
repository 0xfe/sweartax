import API from './api';
import * as H from './helpers';

class PennyJar {
  constructor(code, total, options) {
    this.options = Object.assign(
      {},
      {
        api: null,
      },
      options,
    );

    this.code = code;
    this.total = total;
    this.donors = {};
    this.api = this.options.api || new API();
    H.log('Created PennyJar:', this.code);
  }

  load(data) {
    this.total = data.amount;
    return this;
  }

  donate(who, receipt) {
    H.log('Processing receipt:', receipt);
    const donated = parseFloat(receipt.amount);
    H.log(`Donating ${donated} to PennyJar ${this.code}...`);
    return this.api.donate({ code: this.code, who, receipt }).then((resp) => {
      H.log('Got response:', resp);
      if (resp.success) {
        if (typeof this.donors[who] === 'number') {
          this.donors[who] += donated;
        } else {
          this.donors[who] = donated;
        }

        this.total += donated;
      }

      return resp;
    });
  }

  donors() {
    // Return a sorted list of donors
    return Object.keys(this.donors)
      .sort((a, b) => this.donors[a] > this.donors[b])
      .map(who => ({ name: who, amount: this.donors[who] }));
  }
}

class JarBuilder {
  constructor(options) {
    this.options = Object.assign(
      {},
      {
        el: document.body,
        baseURL: null,
        cost: 0.1,
      },
      options,
    );

    this.api = new API({ baseURL: this.options.baseURL });
  }

  create(who) {
    H.log('Creating new PennyJar...');
    return this.api.create({ who }).then((resp) => {
      H.log('Got response:', resp);
      if (resp.success) {
        return new PennyJar(resp.data.code, 0, { api: this.api });
      }
      return resp;
    });
  }

  load(code) {
    H.log('Looking up PennyJar with code:', code);
    return this.api.lookup({ code }).then((resp) => {
      H.log('Got response:', resp);
      if (resp.success) {
        return new PennyJar(code, 0, { api: this.api }).load(resp.data);
      }
      return resp;
    });
  }
}

function init() {}

export { PennyJar, JarBuilder, init };
