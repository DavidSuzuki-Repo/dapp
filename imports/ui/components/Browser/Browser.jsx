import { Meteor } from 'meteor/meteor';
import { TAPi18n } from 'meteor/tap:i18n';
import { $ } from 'meteor/jquery';

import { timers, defaults } from '/lib/const';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getTemplateImage } from '/imports/ui/templates/layout/templater.js';
import { getWeb3Wallet } from '/imports/startup/both/modules/metamask';

import Search from '/imports/ui/templates/widgets/search/search.jsx';
import Account from '/imports/ui/components/Account/Account.jsx';

// scroll settings
let lastScrollTop = 0;

/**
* @summary displays the contents of a poll
*/
export default class Browser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      icon: {
        logo: '',
        signout: '',
      },
      accounts: [defaults.EMPTY],
      node: document.getElementById('browser'),
      scrollUp: false,
    };

    this.handleScroll = this.handleScroll.bind(this);
  }

  async componentDidMount() {
    await this.setIcons();
    await this.getAccounts();
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  async setIcons() {
    this.setState({
      icon: {
        logo: await getTemplateImage('logo'),
        signout: await getTemplateImage('signout'),
      },
    });
  }

  async getAccounts() {
    const web3 = getWeb3Wallet();
    const accounts = await web3.eth.getAccounts();

    if (accounts.length > 0) {
      this.setState({ accounts });
    }
  }

  getSignedAccount() {
    return this.state.accounts[0];
  }

  getScrollClass() {
    if (this.state.scrollUp) {
      return 'hero-navbar topbar hero-navbar-scroller hero-navbar-up';
    }
    return 'hero-navbar topbar hero-navbar-scroller hero-navbar-down';
  }

  handleScroll() {
    const st = window.pageYOffset || document.documentElement.scrollTop;

    if ((st > lastScrollTop) && !this.state.scrollUp) {
      this.setState({ scrollUp: true });
    } else if ((st <= lastScrollTop) && this.state.scrollUp) {
      this.setState({ scrollUp: false });
    }
    lastScrollTop = st <= 0 ? 0 : st;
  }


  connectedWallet() {
    return (this.state.accounts.length > 0 && this.state.accounts[0] !== defaults.EMPTY);
  }

  render() {
    return (
      <div id="browser" className={this.getScrollClass()}>
        <div className="topbar-max">
          <div id="nav-home" className="hero-home-button">
            <img className="hero-logo" role="presentation" src={this.state.icon.logo} />
          </div>
          {(this.connectedWallet()) ?
            <div className="hero-button hero-button-mobile hero-signin">
              <div id="sign-out-button" className="hero-menu-link hero-menu-link-signin-simple hero-menu-link-signin-simple-icon" target="_blank">
                <img src={this.state.icon.signout} role="presentation" title={TAPi18n.__('sign-out')} className="signout" />
              </div>
              <div id="collective-login" className="hero-menu-link hero-menu-link-signin-simple" target="_blank">
                <Account publicAddress={this.getSignedAccount()} width="20px" height="20px" format="plainText" />
              </div>
            </div>
            :
            <div className="hero-button hero-button-mobile hero-signin">
              <div id="collective-login" className="hero-button hero-button-mobile">
                <div className="hero-menu-link hero-menu-link-signin" target="_blank">
                  {TAPi18n.__('sign-in')}
                </div>
              </div>
            </div>
          }
          <Search />
        </div>
      </div>
    );
  }
}

Browser.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  accountAddress: PropTypes.string,
  percentage: PropTypes.string,
  label: PropTypes.string,
  voteValue: PropTypes.number,
  votingPeriodBegins: PropTypes.string,
  votingPeriodEnds: PropTypes.string,
  title: PropTypes.string,
  proposalIndex: PropTypes.string,
  publicAddress: PropTypes.string,
  daoName: PropTypes.string,
  now: PropTypes.number,
};

