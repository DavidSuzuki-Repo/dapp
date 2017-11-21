import { $ } from 'meteor/jquery';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { gui } from '/lib/const';

import './paginator.html';
import './feedLoad.js';


/**
* @summary if the end of the currently loaded feed was reached
* @param {string} id div element signalling end of feed
*/
const _aboveFold = (id) => {
  if ($(`#page-${id}`)[0]) {
    const rect = $(`#page-${id}`)[0].getBoundingClientRect();
    return (rect.top > -1 && rect.bottom <= parseInt($(window).height() + 300, 10));
  }
  return false;
};

Template.paginator.onCreated(function () {
  Template.instance().identifier = parseInt(((this.data.options.limit + this.data.options.skip) / gui.ITEMS_PER_PAGE) + 1, 10);
  Template.instance().loaded = new ReactiveVar(false);
});

Template.paginator.onRendered(function () {
  const identifier = Template.instance().identifier;
  const loaded = Template.instance().loaded;

  $('.right').scroll(() => {
    if (!loaded.get()) {
      if (_aboveFold(identifier)) {
        console.log('sub feed loaded');
        loaded.set(true);
      }
    }
  });
});

Template.paginator.helpers({
  end() {
    return !((this.options.skip + this.options.limit) < this.count);
  },
  empty() {
    return (this.count === 0);
  },
  identifier() {
    return Template.instance().identifier;
  },
  visible() {
    return Template.instance().loaded.get();
  },
  nextOptions() {
    let nextSkip = (this.options.skip + gui.ITEMS_PER_PAGE);
    if (nextSkip > this.count) { nextSkip = this.count; }
    this.options.skip = nextSkip;
    return this.options;
  },
});

Template.paginator.events({
  'click #feed-bottom'() {
    $('.right').animate({ scrollTop: 0 });
  },
});
