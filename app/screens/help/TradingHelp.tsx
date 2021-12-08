import React from 'react';
import { View } from 'react-native';

import { Code, Grid, Heading, Page, Paragraph, Spacer } from './common';
export default function TradingHelp() {
  return (
    <Page>
      <Heading first> Trading</Heading>
      <Paragraph>
        This page will give a very quick introduction on how to interpret the terms used by the DEX
        and how trading pairs are presented.
      </Paragraph>
      <Heading>Pairs</Heading>
      <Paragraph>
        In META1, almost any asset can be traded with all other assets. Once we have picked two
        assets, we usually refer to a market pair. For instance, we can trade USDT against EUR in
        the USDT:EUR pair.
      </Paragraph>
      <Spacer />
      <Paragraph>
        For sake of consistency, we will use the generalized terms base and quote such that pairs
        are represented as{'\n'}
        <Code>*quote* : *base*</Code>
      </Paragraph>
      <Paragraph>
        and for instance with base being USDT and quote being EUR, denote the EUR:USDT pair.
      </Paragraph>
      <Heading>Order Books</Heading>
      <Paragraph>
        The order book consists of an ask and a bid side. Since trading pairs do not have a
        preferred orientation, and can be flipped, the following table shall give an overview of
        ask/bid and the corresponding buy/sell operations for each side:
      </Paragraph>
      <View style={{ backgroundColor: '#000', padding: 12 }}>
        {/* prettier-ignore */}
        <Grid notFixedSize>
         Side       | Sell    | Buy     ;;
         Ask        | *quote* | *base*  ;;
         Bid        | *base*  | *quote* ;;
        </Grid>
      </View>
      <Paragraph>
        Obviously, what is on the bid side of the USDT:EUR pair will be on the ask side on the
        EUR:USDT pair. Of course prices are internally represented as fractions, and thus results
        in both pairs being identical.
      </Paragraph>

      <Heading>Trading</Heading>

      <Paragraph>
        To place a trading order, it is required to fill the form on either the ask or the bid side
        (respectively, buy or sell side). You will need to define a price and an amount to
        sell/buy. The cost for this order will be calculated automatically. Note that there will be
        an additional fee required to actually place the order. {'\n'}Once the order is filled
        (i.e. someone sold/bought your offer), your account will be credited by the corresponding
        asset. {'\n'}Unfilled orders can be canceled at any time.
      </Paragraph>
    </Page>
  );
}
