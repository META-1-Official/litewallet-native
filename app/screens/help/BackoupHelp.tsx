import React from 'react';
import { Heading, Link, Page, Paragraph, Spacer } from './common';

export default function BackupHelp() {
  return (
    <Page>
      <Heading first>Backups</Heading>
      <Heading>Local Wallet</Heading>
      <Paragraph>
        It is recommended to make regular backups of your Local Wallet even though in most cases a
        single backup may be sufficient. Please note that in order to recover from a backup you
        will also need to provide the passphrase (password) because backups are encrypted. Hence,
        if you either lose your wallet or your passphrase you will be unable to access any of your
        funds again! You can create a backup from <Link>Settings {'->'} Backup.</Link>
      </Paragraph>
      <Spacer />
      <Paragraph>
        {'>'} Store this backup in at least two secure locations only accessible by you
      </Paragraph>
      <Paragraph>
        {'>'} The backup is encrypted with your passphrase/password so do not store your passwrod
        in the same location
      </Paragraph>
      <Heading>Advanced Users Only</Heading>
      <Heading>Brainkey</Heading>
      <Paragraph>
        If you never manually imported an account key into your wallet, you can alternatively
        backup your accounts and their funds by exporting the brainkey, a string of words from
        which your keys are derived deterministically.
      </Paragraph>
      <Heading>Remark: Hierarchical Authorities (advanced uses ONLY)</Heading>
      <Paragraph>
        If you are using hierarchical authorities (account and/or active permissions), backing up
        your keys alone may not be sufficient to regain access to your funds! Please revise the
        documentations about hierarchical authorities.
      </Paragraph>
    </Page>
  );
}
