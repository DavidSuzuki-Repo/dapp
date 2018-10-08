import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const Schema = {};

Schema.Coin = new SimpleSchema({
  code: {
    type: String,
    optional: true,
  },
});

Schema.Ticket = new SimpleSchema({
  hash: {
    type: String,
    optional: true,
  },
  status: {
    type: String,
    allowedValues: ['CONFIRMED', 'PENDING'],
    defaultValue: 'PENDING',
  },
  value: {
    type: String,
    defaultValue: '0',
  },
});

Schema.Blockchain = new SimpleSchema({
  publicAddress: {
    type: String,
    defaultValue: '',
  },
  coin: {
    type: Schema.Coin,
    optional: true,
  },
  tickets: {
    type: [Schema.Ticket],
    defaultValue: [],
  },
  price: {
    type: String,
    defaultValue: '1',
  },
  balance: {
    type: String,
    defaultValue: '0',
  },
});

export const Blockchain = Schema.Blockchain;
