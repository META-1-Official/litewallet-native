import React from 'react';
import { Heading, Page, Paragraph, Link } from './common';

export default function VotingHelp() {
  return (
    <Page>
      <Heading first>Voting</Heading>
      <Paragraph>
        Voting is important in META1 in the same way it is important to the community in which you
        live. The weight of your vote is directly correlated to the number of META1 you own. If you
        aren't heavily involved in the community, you are encouraged to choose a proxy who
        represents your interests. If you would like to be more involved in the community, check
        out these <Link onPress={() => 'https://t.me/meta1exchange'}>channels</Link>.
      </Paragraph>
      <Heading>Proxy</Heading>
      <Paragraph>
        You may choose to not be active in the governance of META1. If this is the case, it's
        important that you choose someone in the META1 community who you identify with and set that
        entity as your proxy. This gives them to the power to vote on your behalf with your META1
        shares backing their vote. This is similar to electing a representative.
      </Paragraph>
      <Heading>Witnesses</Heading>
      <Paragraph>
        Witnesses are entities that work for the blockchain by constructing new blocks. Their role
        is similar to the role of miners for Bitcoin and other blockchains. Each witness is
        approved by the shareholders and constructs and signs blocks from validated transactions.
        Every transaction made in the network is required to be validated by all witnesses.
      </Paragraph>
      <Heading>Consensus Mechanism</Heading>
      <Paragraph>
        Who exactly is allowed to produce a block at which time instant is defined by a consensus
        mechanism called Delegated Proof of Stake. In essence, you, the shareholders of META1 can
        cast a vote for your preferred block producers on the blockchain. Those witnesses with the
        most votes are allowed to produce blocks.
      </Paragraph>
      <Heading>Committee</Heading>
      <Paragraph>
        The committee is a set of entities that are approved by the shareholders and set policy for
        the META1 blockchain including:
      </Paragraph>
      <Paragraph>
        {'\n'}
        {'>'}Transaction and trading fees
        {'\n'}
        {'>'}Blockchain parameters, such as block size, block interval
        {'\n'}
        {'>'}Referral and vesting parameters such as cash back percentage and vesting periods
      </Paragraph>
      <Heading>Workers</Heading>
      <Paragraph>
        Workers are proposals to perform a service in return for a salary from the blockchain. A
        worker proposal contains at a minimum the following information:
      </Paragraph>
      <Paragraph>
        {'\n'}
        {'>'}A start and end date
        {'\n'}
        {'>'}A daily pay
        {'\n'}
        {'>'}A maximum total pay
        {'\n'}
        {'>'}A link to a webpage where the worker proposal is explained
      </Paragraph>
      <Heading>Worker Lifecycle</Heading>
      <Heading>Proposed</Heading>
      <Paragraph>
        These worker proposals have been submitted to the blockchain and are being actively voted
        on. In order to become active, they must exceed the refund400k worker in total votes.
      </Paragraph>
      <Heading>Active</Heading>
      <Paragraph>
        These worker proposals have exceeded the threshold and are being actively paid. Active
        workers can be defunded if their vote threshold is reduced below the refund400k worker
        level.
      </Paragraph>
      <Heading>Expired</Heading>
      <Paragraph>
        These worker proposals are displayed for historical purposes. You will find propsals that
        have ended based upon their end date.
      </Paragraph>
      <Heading>Worker budget mechanics</Heading>
      <Paragraph>
        Workers receive pay from a fixed daily budget on a first-come, first-serve basis until
        there are no more funds left.
      </Paragraph>
      <Paragraph>
        {'\n'}
        {'>'}A daily total budget of 400k META1 for all workers
        {'\n'}
        {'>'}5 worker proposals with a positive votes total, with daily pay requests of 100k META1
        each
      </Paragraph>
      <Paragraph>
        Now the four workers with the most votes will all receive 100k META1 each per day, but once
        they've been paid the worker budget is empty. Therefore the fifth worker will receive
        nothing.
      </Paragraph>
    </Page>
  );
}
