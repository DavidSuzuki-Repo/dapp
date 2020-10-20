import React from 'react';

import { shortenCryptoName } from 'utils/strings';
import { WithContext as ReactTags } from 'react-tag-input';
import { withRouter } from 'react-router-dom';

import PropTypes from 'prop-types';

import { findLast } from 'lodash';
import { gui } from 'lib/const';

import i18n from 'i18n';
import 'styles/Dapp.css';

const Web3 = require('web3');

const suggestList = [];

const KeyCodes = {
  enter: 13,
};

const delimiters = [KeyCodes.enter];

/**
 * @summary inserts in the search cache an item
 * @param {sting} url that has the address of the item searched
 * @param {sring} text that represents the item
 */
const _includeInSearch = (url, text, kind) => {
  if (!findLast(suggestList, { id: url })) {
    suggestList.push({
      id: url,
      text: i18n.t(kind, { searchTerm: text }),
    });
  }
};

const _dynamicTitle = (label) => {
  const web3 = new Web3();
  if (web3.utils.isAddress(label)) {
    return shortenCryptoName(label).toUpperCase();
  }
  if (label.length > 18) {
    return `${label.substring(0, 15)}...`;
  }
  return label;
};

const _getTags = (contextTag) => {
  if (!contextTag) {
    return [];
  }
  const finalTag = contextTag;
  finalTag.text = (contextTag.text.length > gui.MAX_LENGTH_TAG_LABELS) ? `${contextTag.text.substring(0, gui.MAX_LENGTH_TAG_LABELS)}...` : contextTag.text;
  return [finalTag];
};

const _replacementText = (tag) => {
  if (tag.id.slice(0, 9) === '/address/') {
    return i18n.t('search-user', { searchTerm: _dynamicTitle(tag.id.slice(9, 51)) });
  } else if (tag.id.slice(0, 1) !== '/') {
    console.log(`tag.text: ${tag.text}`);
    return i18n.t('search-default', { searchTerm: _dynamicTitle(tag.text) });
  }
  return _dynamicTitle(tag.text);
};

class Search extends React.Component {
  static propTypes = {
    contextTag: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.state = {
      subscription: true, // Router.current().ready(),
      tags: _getTags(props.contextTag),
      suggestions: suggestList,
      pasting: false,
    };
    this.handleAddition = this.handleAddition.bind(this);
    this.handlePaste = this.handlePaste.bind(this);
    this.removeTag = this.removeTag.bind(this);
  }

  componentDidMount() {
    if (document.getElementsByClassName('ReactTags__tagInputField')[0]) {
      document.getElementsByClassName('ReactTags__tagInputField')[0].addEventListener('paste', this.handlePaste);
    }
  }

  handleAddition(tag) {
    const web3 = new Web3();

    console.log(tag);
    console.log(this.props);
    console.log(`this.state.pasting: ${this.state.pasting}`);

    if (!this.state.pasting) {
      if (tag.id.slice(0, 1) === '/') {
        console.log(tag.id);
        this.props.history.push(tag.id);
      } else if (web3.utils.isAddress(tag.id)) {
        this.props.history.push(`/address/${tag.id}`);
      } else {
        this.props.history.push(`/search/${escape(tag.id)}`);;
      }
    }
    this.setState({ pasting: false })
  }

  handlePaste(e) {
    e.stopPropagation();
    e.preventDefault();
    const clipboardData = e.clipboardData || window.clipboardData;
    const paste = clipboardData.getData('Text');
    this.setState({ pasting: true })
    setTimeout(function () {
      document.getElementsByClassName('ReactTags__tagInputField')[0].value = paste;
    }, 50);
  }

  mobileContext() {
    return ((window.innerWidth < 768) && (this.state.tags.length > 0));
  }

  removeTag() {
    this.setState({ tags: [] });
  }

  render() {
    const { tags, suggestions } = this.state;

    if (this.mobileContext()) {
      return (
        <div className="search-wrapper-logged">
          <div className="ReactTags__tags react-tags-wrapper">
            <div className="ReactTags__selected">
              <span className="tag-wrapper ReactTags__tag">
                {this.state.tags[0].text}
                <div className="ReactTags__remove" onClick={this.removeTag}>×</div>
              </span>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="search-wrapper-logged">
        <ReactTags
          tags={tags}
          suggestions={suggestions}
          handleAddition={this.handleAddition}
          handlePaste={this.handlePaste}
          delimiters={delimiters}
          placeholder={(window.innerWidth < 768) ? i18n.t('search-short') : i18n.t('search-daos')}
        />
      </div>
    );
  }
}

export default withRouter(Search);
export const includeInSearch = _includeInSearch;
