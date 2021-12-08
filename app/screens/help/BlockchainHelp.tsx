import React from 'react';
import { Heading, Page, Paragraph } from './common';

export function BlockchainHelp() {
  return (
    <Page>
      <Heading first>Blockchain</Heading>
      <Paragraph>
        As most crypto currencies, Graphene makes use of a blockchain to update participants about
        transfers and market activities. Since blocks always refer to the previous block, we get a
        chain of blocks (blockchain) that contains all transactions every made in the network.
        Because the blockchain is a publicly accessible and auditable ledger, everyone can take a
        closer look and verify transfers as well as market orders and order books. Of course, this
        web wallet offers a block explorer to assist you with your audit.
      </Paragraph>
      <Heading>Consensus Mechanism</Heading>
      <Paragraph>
        Who exactly is allows to produce a block at which time instant is defined by a consensus
        mechanism called Delegated Proof of Stake. In essence, the shareholders of META1 (holders
        of the META1 token) can cast a vote for their preferred block producers on the blockchain.
        Those so called witnesses with the most votes are allowed to produce blocks.
      </Paragraph>
      <Heading>Transactions</Heading>
      <Paragraph>
        The Graphene blockchain technology offers a variety of transaction types. Users are not
        only able to simply transfer assets between each other, but there are also transactions to
        interact with the decentralized exchange. Most of these transaction types are labeled with
        a self-explaining tag, others require more knowledge about the inner workings of the
        company.
      </Paragraph>
    </Page>
  );
}
