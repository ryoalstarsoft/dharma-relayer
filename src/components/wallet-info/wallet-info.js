import React, { Component } from 'react';
import './wallet-info.css';
import Spinner from '../spinner/spinner';
import { SUPPORTED_TOKENS } from '../../common/api/config';

let timer = null;

let startTimer = (func) => {
  timer = setTimeout(() => {
    func();
    startTimer(func);
  }, 5000)
};

class WalletInfo extends Component {
  constructor(props) {
    super(props);

    this.renderCurrencyItems = this.renderCurrencyItems.bind(this);
  }

  componentDidMount() {
    let { getWalletInfo } = this.props;
    getWalletInfo();
    startTimer(getWalletInfo);
  }

  componentWillUnmount() {
    timer && clearTimeout(timer);
  }

  renderCurrencyItems(selectedCurrency) {
    return ['ETH'].concat(SUPPORTED_TOKENS).map(currency => {
      return (
        <div key={currency} className={"wallet-info__currency" + (selectedCurrency === currency ? " wallet-info__currency_active" : "")}
          onClick={() => { this.props.selectCurrency(currency) }}>
          {currency}
        </div>
      );
    });
  }

  render() {
    let { address, amount, selectedCurrency, isProcessing } = this.props;

    let amountString;
    if (amount) {
      amountString = amount.toFormat(3);
    }

    return (
      <div className="wallet-info">
        <div className="wallet-info__logo">
        </div>
        <div className="wallet-info__address">
          <p>Ethereum address</p>
          <span>
            {address}
          </span>
        </div>
        <div className="wallet-info__balance-info">
          <p>Balance</p>
          <div>
            {isProcessing ? <Spinner></Spinner> :
              <span className="wallet-info__balance" title={`${amountString} ${selectedCurrency}`}>
                <strong>{amountString}</strong> {selectedCurrency}
              </span>
            }
            <div className="wallet-info__currency-container">
              {this.renderCurrencyItems(selectedCurrency)}
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default WalletInfo;