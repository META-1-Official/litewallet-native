import React from 'react';
import { Heading, Page, Paragraph, Spacer } from './common';

export default function DexHelp() {
  return (
    <Page>
      <Heading first>Decentralized Exchange</Heading>
      <Paragraph>
        The decentralized exchange (further denoted simply as the DEX) allows for direct exchange
        of digital goods traded in the META1 ecosystem.
      </Paragraph>
      <Spacer />
      <Paragraph>
        A decentralized exchange has a very particular set of advantages over traditional
        centralized exchanges and we would like to address some of them briefly below. Although the
        META1 DEX comes with all of them, it is up to the reader and customer to leverage those
        features in full or only partially.
      </Paragraph>
      <Spacer />
      <Paragraph>
        {'>'} Separation of Powers: There is no reason why the same entity needs to be responsible
        for issuing IOUs and for processing the order book. In META1, order matching is performed
        by the protocol, which is unaware of implications concerning the involved assets.
      </Paragraph>
      <Spacer />
      <Paragraph>
        {'>'} Global Unified Order Book: Since META1 is global, anybody with an internet access can
        use the DEX for trading. This brings the world's liquidity to a single order book for
        decentralized trading.
      </Paragraph>
      <Spacer />
      <Paragraph>
        {'>'} Trade Almost Anything: The META1 DEX is asset agnostic. Hence you can trade at any
        pair. While some pairs may end up with low liquidity, such as SILVER:GOLD, other pairs such
        as USDT:EUR for FOREX trading will see huge volume.
      </Paragraph>
      <Spacer />
      <Paragraph>
        {'>'} No Limits: The META1 protocol is unable to limit your trading experience.
      </Paragraph>
      <Spacer />
      <Paragraph>
        {'>'} Decentralized: The DEX is decentralized across the globe. This not only means that
        there is no single point of failure, but it also implies that the META1 exchange is open
        for trading 24/7 because it's always daytime somewhere.
      </Paragraph>
      <Spacer />
      <Paragraph>
        {'>'} Secure: Your funds and trades are secured with industry-grade elliptic curve
        cryptography. No one will be able to access your funds unless you let them. To further
        strengthen the security, we allow our customers to setup escrow and multi-signature
        schemes.
      </Paragraph>
      <Spacer />
      <Paragraph>
        {'>'} Fast: In contrast to other decentralized networks, the META1 DEX allows for real-time
        trading and is only limited by the speed of light and the size of the planet.
      </Paragraph>
      <Spacer />
      <Paragraph>
        {'>'} Provable Order Matching Algorithm: What makes the META1 DEX unique is the provable
        order matching algorithm. Given a set of orders, you will always be able to provably verify
        that these orders have been matched properly.
      </Paragraph>
    </Page>
  );
}
