import React from 'react';
import { Heading, Page, Paragraph } from './common';

export default function MembershipHelp() {
  return (
    <Page>
      <Heading first>Memberships</Heading>
      <Paragraph>
        Accounts in META1 are separated into three groups. We decided to give users the option to
        upgrade their accounts into a VIP-like status if they desire and profit from reduced fees
        and additional features.
      </Paragraph>
      <Heading>Non-Members</Heading>
      <Paragraph>A regular account is a non-member.</Paragraph>
      <Heading>Lifetime Members</Heading>
      <Paragraph>
        Lifetime Members get a percentage cashback on every transaction fee they pay and income
        from referrals. A Lifetime membership is associated with a certain one-time fee defined in
        this schedule.
      </Paragraph>
      <Heading>Fee Division</Heading>
      <Paragraph>
        Every time an account you referred pays a transaction fee, that fee is divided among
        several different accounts. The network takes a cut, and the Lifetime Member who referred
        the account gets a cut.
      </Paragraph>
      <Paragraph>
        The registrar is the account that paid the transaction fee to register the account with the
        network. The registrar gets to decide how to divide the remaining fee between themselves
        and their own affiliate.
      </Paragraph>
      <Heading>Pending Fees</Heading>
      <Paragraph>
        Fees paid are only divided among the network, referrers, and registrars once every
        maintenance interval.
      </Paragraph>
      <Heading>Vesting Fees</Heading>
      <Paragraph>
        Most fees are made available immediately, but fees over the vesting threshold (such as
        those paid to upgrade your membership or register a premium account name) must vest for
        some period of time as defined by the committee.
      </Paragraph>
    </Page>
  );
}
