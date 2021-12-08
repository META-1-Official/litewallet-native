import React from 'react';

import { Heading, Page, Paragraph } from './common';
export default function ProposedTxHelp() {
  return (
    <Page>
      <Heading first>Proposed Transactions</Heading>
      <Paragraph>
        This is an advanced feature of META1 accessible from the send feature. It allows for
        something known a multisig. Imagine you have a single account but require more than one
        person to authorize a transaction. This capability is built into meta, but requires
        advanced knowledge and there is a setup process. If you haven't previously setup multisig
        for your account, it's safe to say you do not need it.
      </Paragraph>
    </Page>
  );
}
