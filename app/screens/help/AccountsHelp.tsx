import React from 'react';
import { Heading, Page, Paragraph } from './common';

export default function AccoutnsHelp() {
  return (
    <Page>
      <Heading first>Accounts</Heading>
      <Paragraph>
        As you may have already noticed by now, this blockchain technology requires you to register
        an account name. This comes with many advantages: Besides improved scalability, we have
        separated the identity from the transaction authorizing signature. In practice, owning an
        account name is independent from being able to spend its funds. Furthermore, both rights
        (we call them permissions) can split among an arbitrary complex relation of people (we call
        them authorities) using weights and a required thresholds.
      </Paragraph>
    </Page>
  );
}
