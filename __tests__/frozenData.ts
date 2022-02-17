export const openFrozen = {
  order: {
    raw: {
      id: '1.11.31864645',
      op: [
        1,
        {
          fee: {
            amount: 2,
            asset_id: '1.3.0',
          },
          seller: '1.2.102',
          amount_to_sell: {
            amount: 169785862,
            asset_id: '1.3.0',
          },
          min_to_receive: {
            amount: 40125222,
            asset_id: '1.3.1',
          },
          expiration: '2027-02-16T12:01:22',
          fill_or_kill: false,
          extensions: [],
        },
      ],
      result: [1, '1.7.10294583'],
      block_num: 9794685,
      trx_in_block: 3,
      op_in_trx: 0,
      virtual_op: 0,
    },
    limit_order_create_operation: {
      fee: {
        amount: 2,
        asset_id: '1.3.0',
      },
      seller: '1.2.102',
      amount_to_sell: {
        amount: 169785862,
        asset_id: '1.3.0',
      },
      min_to_receive: {
        amount: 40125222,
        asset_id: '1.3.1',
      },
      expiration: '2027-02-16T12:01:22',
      fill_or_kill: false,
      extensions: [],
      result: {
        object_id_type: '1.7.10294583',
      },
    },
  },
  filled: [],
};

export const canceledFrozen = {
  order: {
    raw: {
      id: '1.11.31871485',
      op: [
        1,
        {
          fee: {
            amount: 2,
            asset_id: '1.3.0',
          },
          seller: '1.2.102',
          amount_to_sell: {
            amount: 8368246,
            asset_id: '1.3.1',
          },
          min_to_receive: {
            amount: 35659282,
            asset_id: '1.3.0',
          },
          expiration: '2027-02-16T13:53:17',
          fill_or_kill: false,
          extensions: [],
        },
      ],
      result: [1, '1.7.10297092'],
      block_num: 9796028,
      trx_in_block: 2,
      op_in_trx: 0,
      virtual_op: 0,
    },
    limit_order_create_operation: {
      fee: {
        amount: 2,
        asset_id: '1.3.0',
      },
      seller: '1.2.102',
      amount_to_sell: {
        amount: 8368246,
        asset_id: '1.3.1',
      },
      min_to_receive: {
        amount: 35659282,
        asset_id: '1.3.0',
      },
      expiration: '2027-02-16T13:53:17',
      fill_or_kill: false,
      extensions: [],
      result: {
        object_id_type: '1.7.10297092',
      },
    },
  },
  canceled: {
    raw: {
      id: '1.11.31871588',
      op: [
        2,
        {
          fee: {
            amount: 0,
            asset_id: '1.3.0',
          },
          fee_paying_account: '1.2.102',
          order: '1.7.10297092',
          extensions: [],
        },
      ],
      result: [
        2,
        {
          amount: 8357146,
          asset_id: '1.3.1',
        },
      ],
      block_num: 9796046,
      trx_in_block: 1,
      op_in_trx: 0,
      virtual_op: 0,
    },
    limit_order_cancel_operation: {
      fee: {
        amount: 0,
        asset_id: '1.3.0',
      },
      fee_paying_account: '1.2.102',
      order: '1.7.10297092',
      extensions: [],
      result: {
        asset: {
          amount: 8357146,
          asset_id: '1.3.1',
        },
      },
    },
  },
  filled: [
    {
      raw: {
        id: '1.11.31871489',
        op: [
          4,
          {
            fee: {
              amount: 0,
              asset_id: '1.3.0',
            },
            order_id: '1.7.10297092',
            account_id: '1.2.102',
            pays: {
              amount: 11100,
              asset_id: '1.3.1',
            },
            receives: {
              amount: 47300,
              asset_id: '1.3.0',
            },
            fill_price: {
              base: {
                amount: 8368246,
                asset_id: '1.3.1',
              },
              quote: {
                amount: 35659282,
                asset_id: '1.3.0',
              },
            },
            is_maker: true,
          },
        ],
        result: [0, {}],
        block_num: 9796029,
        trx_in_block: 0,
        op_in_trx: 0,
        virtual_op: 2,
      },
      fill_order_operation: {
        fee: {
          amount: 0,
          asset_id: '1.3.0',
        },
        order_id: '1.7.10297092',
        account_id: '1.2.102',
        pays: {
          amount: 11100,
          asset_id: '1.3.1',
        },
        receives: {
          amount: 47300,
          asset_id: '1.3.0',
        },
        fill_price: {
          base: {
            amount: 8368246,
            asset_id: '1.3.1',
          },
          quote: {
            amount: 35659282,
            asset_id: '1.3.0',
          },
        },
        is_maker: true,
        result: {
          void_result: {},
        },
      },
    },
  ],
};
export const filledFrozen = {
  order: {
    raw: {
      id: '1.11.31871485',
      op: [
        1,
        {
          fee: { amount: 2, asset_id: '1.3.0' },
          seller: '1.2.102',
          amount_to_sell: { amount: 8368246, asset_id: '1.3.1' },
          min_to_receive: { amount: 35659282, asset_id: '1.3.0' },
          expiration: '2027-02-16T13:53:17',
          fill_or_kill: false,
          extensions: [],
        },
      ],
      result: [1, '1.7.10297092'],
      block_num: 9796028,
      trx_in_block: 2,
      op_in_trx: 0,
      virtual_op: 0,
    },
    limit_order_create_operation: {
      fee: { amount: 2, asset_id: '1.3.0' },
      seller: '1.2.102',
      amount_to_sell: { amount: 8368246, asset_id: '1.3.1' },
      min_to_receive: { amount: 35659282, asset_id: '1.3.0' },
      expiration: '2027-02-16T13:53:17',
      fill_or_kill: false,
      extensions: [],
      result: { object_id_type: '1.7.10297092' },
    },
  },
  canceled: {
    raw: {
      id: '1.11.31871588',
      op: [
        2,
        {
          fee: { amount: 0, asset_id: '1.3.0' },
          fee_paying_account: '1.2.102',
          order: '1.7.10297092',
          extensions: [],
        },
      ],
      result: [2, { amount: 8357146, asset_id: '1.3.1' }],
      block_num: 9796046,
      trx_in_block: 1,
      op_in_trx: 0,
      virtual_op: 0,
    },
    limit_order_cancel_operation: {
      fee: { amount: 0, asset_id: '1.3.0' },
      fee_paying_account: '1.2.102',
      order: '1.7.10297092',
      extensions: [],
      result: { asset: { amount: 8357146, asset_id: '1.3.1' } },
    },
  },
  filled: [
    {
      raw: {
        id: '1.11.31871489',
        op: [
          4,
          {
            fee: { amount: 0, asset_id: '1.3.0' },
            order_id: '1.7.10297092',
            account_id: '1.2.102',
            pays: { amount: 11100, asset_id: '1.3.1' },
            receives: { amount: 47300, asset_id: '1.3.0' },
            fill_price: {
              base: { amount: 8368246, asset_id: '1.3.1' },
              quote: { amount: 35659282, asset_id: '1.3.0' },
            },
            is_maker: true,
          },
        ],
        result: [0, {}],
        block_num: 9796029,
        trx_in_block: 0,
        op_in_trx: 0,
        virtual_op: 2,
      },
      fill_order_operation: {
        fee: { amount: 0, asset_id: '1.3.0' },
        order_id: '1.7.10297092',
        account_id: '1.2.102',
        pays: { amount: 11100, asset_id: '1.3.1' },
        receives: { amount: 47300, asset_id: '1.3.0' },
        fill_price: {
          base: { amount: 8368246, asset_id: '1.3.1' },
          quote: { amount: 35659282, asset_id: '1.3.0' },
        },
        is_maker: true,
        result: { void_result: {} },
      },
    },
  ],
};

export const filledFake = {
  order: {
    raw: {
      id: '1.11.31871485',
      op: [
        1,
        {
          fee: { amount: 2, asset_id: '1.3.0' },
          seller: '1.2.102',
          amount_to_sell: { amount: 8368246, asset_id: '1.3.1' },
          min_to_receive: { amount: 35659282, asset_id: '1.3.0' },
          expiration: '2027-02-16T13:53:17',
          fill_or_kill: false,
          extensions: [],
        },
      ],
      result: [1, '1.7.10297092'],
      block_num: 9796028,
      trx_in_block: 2,
      op_in_trx: 0,
      virtual_op: 0,
    },
    limit_order_create_operation: {
      fee: { amount: 2, asset_id: '1.3.0' },
      seller: '1.2.102',
      amount_to_sell: { amount: 8368246, asset_id: '1.3.1' },
      min_to_receive: { amount: 35659282, asset_id: '1.3.0' },
      expiration: '2027-02-16T13:53:17',
      fill_or_kill: false,
      extensions: [],
      result: { object_id_type: '1.7.10297092' },
    },
  },
  canceled: undefined,
  filled: [
    {
      raw: {
        id: '1.11.31871489',
        op: [
          4,
          {
            fee: { amount: 0, asset_id: '1.3.0' },
            order_id: '1.7.10297092',
            account_id: '1.2.102',
            pays: { amount: 11100, asset_id: '1.3.1' },
            receives: { amount: 47300, asset_id: '1.3.0' },
            fill_price: {
              base: { amount: 8368246, asset_id: '1.3.1' },
              quote: { amount: 35659282, asset_id: '1.3.0' },
            },
            is_maker: true,
          },
        ],
        result: [0, {}],
        block_num: 9796029,
        trx_in_block: 0,
        op_in_trx: 0,
        virtual_op: 2,
      },
      fill_order_operation: {
        fee: { amount: 0, asset_id: '1.3.0' },
        order_id: '1.7.10297092',
        account_id: '1.2.102',
        pays: { amount: 11100, asset_id: '1.3.1' },
        receives: { amount: 47300, asset_id: '1.3.0' },
        fill_price: {
          base: { amount: 8368246, asset_id: '1.3.1' },
          quote: { amount: 35659282, asset_id: '1.3.0' },
        },
        is_maker: true,
        result: { void_result: {} },
      },
    },
  ],
};

export const expired = {
    order: {
      raw: {
        id: '1.11.31864645',
        op: [
          1,
          {
            fee: {
              amount: 2,
              asset_id: '1.3.0',
            },
            seller: '1.2.102',
            amount_to_sell: {
              amount: 169785862,
              asset_id: '1.3.0',
            },
            min_to_receive: {
              amount: 40125222,
              asset_id: '1.3.1',
            },
            expiration: '1970-01-01T00:00:00.000Z',
            fill_or_kill: false,
            extensions: [],
          },
        ],
        result: [1, '1.7.10294583'],
        block_num: 9794685,
        trx_in_block: 3,
        op_in_trx: 0,
        virtual_op: 0,
      },
      limit_order_create_operation: {
        fee: {
          amount: 2,
          asset_id: '1.3.0',
        },
        seller: '1.2.102',
        amount_to_sell: {
          amount: 169785862,
          asset_id: '1.3.0',
        },
        min_to_receive: {
          amount: 40125222,
          asset_id: '1.3.1',
        },
        expiration: '1970-01-01T00:00:00.000Z',
        fill_or_kill: false,
        extensions: [],
        result: {
          object_id_type: '1.7.10294583',
        },
      },
    },
    filled: [],
  };