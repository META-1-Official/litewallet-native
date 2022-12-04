import React from 'react';
import { SafeAreaView, ScrollView, Text, TextStyle, View } from 'react-native';

type WithChildren<T = {}> = T & { children?: React.ReactNode };

function Heading({ children, first }: WithChildren<{ first?: boolean }>) {
  const comm: TextStyle = {
    marginTop: 18,
    marginBottom: 8,
    fontWeight: '700',
  };
  if (first) {
    return <Text style={[comm, { fontSize: 28 }]}>{children}</Text>;
  }
  return <Text style={[comm, { fontSize: 20 }]}>{children}</Text>;
}

function Paragraph({ children }: WithChildren) {
  return <Text style={{ fontSize: 18 }}>{children}</Text>;
}

function Page({ children }: WithChildren) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={{ marginHorizontal: 18 }} contentContainerStyle={{ paddingBottom: 200 }}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

function Ulli({ children }: WithChildren) {
  return (
    <View style={{ flexDirection: 'row' }}>
      <View
        style={{ width: 6, height: 6, backgroundColor: '#222', borderRadius: 6, marginTop: 8 }}
      />
      <Text style={{ flex: 1, paddingLeft: 5, fontSize: 18 }}>{children}</Text>
    </View>
  );
}

export function Spacer() {
  return <View style={{ height: 18 }} />;
}

export function PrivacyPolicy() {
  return (
    <Page>
      <Heading first>Privacy Policy of META 1 Coin</Heading>
      <Paragraph>
        META 1 Coin operates the META 1 Mobile Wallet which provides access to the METANOMICS
        Eco-sphere. This page is used to inform website visitors regarding our policies with the
        collection, use, and disclosure of Personal Information if anyone decided to use our
        Service, the Website Name website. If you choose to use our Service, then you agree to the
        collection and use of information in relation with this policy. The Personal Information
        that we collect are used for providing and improving the Service. We will not use or share
        your information with anyone including any government agency or law enforcement.
      </Paragraph>
      <Heading>Information Collection and Use</Heading>
      <Paragraph>
        For a better experience while using our Service, we may require you to provide us with
        certain personally identifiable information, including but not limited to your name, phone
        number, email and postal address. The information that we collect will be used to contact
        or identify you.
      </Paragraph>
      <Heading>Log Data</Heading>
      <Paragraph>
        We want to inform you that whenever you visit our Service, we collect information that your
        browser sends to us that is called Log Data. This Log Data may include information such as
        your computer's Internet Protocol (“IP”) address, browser version, pages of our Service
        that you visit, the time and date of your visit, the time spent on those pages, and other
        statistics.
      </Paragraph>
      <Heading>Cookies</Heading>
      <Paragraph>
        Cookies are files with small amount of data that is commonly used an anonymous unique
        identifier. These are sent to your browser from the website that you visit and are stored
        on your computer's hard drive. Our website uses these “cookies” to collection information
        and to improve our Service. You have the option to either accept or refuse these cookies,
        and know when a cookie is being sent to your computer.
      </Paragraph>
      <Heading>Service Providers</Heading>
      <Paragraph>
        We may employ third-party companies and individuals due to the following reasons:
      </Paragraph>
      <View>
        <Ulli>To facilitate our Service; </Ulli>
        <Ulli>To provide the Service on our behalf;</Ulli>
        <Ulli>To perform Service-related services; or </Ulli>
        <Ulli>To assist us in analyzing how our Service is used.</Ulli>
      </View>
      <Heading>Security</Heading>
      <Paragraph>
        We value your trust in providing us your Personal Information, thus we are striving to use
        commercially acceptable means of protecting it. We go great lengths to protect the privacy
        of our Members as we believe that being private is one of the most important freedoms known
        to humanity. We will NEVER share your data or information about you, META 1 Coin and all
        it’s members operate from a Private International Jurisdictions and any requests from State
        agencies of any kind, for information will be denied.
      </Paragraph>
      <Heading>Links to Other Sites</Heading>
      <Paragraph>
        Our Service may contain links to other sites. If you click on a third-party link, you will
        be directed to that site. Note that these external sites are not operated by us. Therefore,
        we strongly advise you to review the Privacy Policy of these websites. We have no control
        over, and assume no responsibility for the content, privacy policies, or practices of any
        third-party sites or services.
      </Paragraph>
      <Paragraph>Children's Privacy</Paragraph>
      <Paragraph>
        Our Services do not address anyone under the age of 13. We do not knowingly collect
        personal identifiable information from children under 13. In the case we discover that a
        child under 13 has provided us with personal information, we immediately delete this from
        our servers. If you are a parent or guardian and you are aware that your child has provided
        us with personal information, please contact us so that we will be able to do necessary
        actions.
      </Paragraph>
      <Heading>Changes to This Privacy Policy</Heading>
      <Paragraph>
        We may update our Privacy Policy from time to time. Thus, we advise you to review this page
        periodically for any changes. We will notify you of any changes by posting the new Privacy
        Policy on this page. These changes are effective immediately, after they are posted on this
        page.
      </Paragraph>
      <Heading>Contact Us</Heading>
      <Paragraph>
        If you have any questions or suggestions about our Privacy Policy, do not hesitate to
        contact us.
      </Paragraph>
    </Page>
  );
}

export function TOSScreen() {
  return (
    <Page>
      <Heading first>Terms of service</Heading>
      <Paragraph>
        1. This Association of members hereby declares that our main objective is to maintain and
        improve the civil rights, constitutional guarantees, and political freedom of every human
        being born on the United States of America, through the exercise of our constitutional
        rights. This objective also pertains to all law-abiding citizens of other countries around
        the world whose constitutional provisions embrace similar rights and freedoms as those in
        our United States of America.
      </Paragraph>
      <Spacer />
      <Paragraph>
        2. As members, we affirm our belief in the original 1787 Constitution for the united States
        of America. We believe that the First Amendment of the original 1787 Constitution for the
        united States of America guarantees our members the rights of free speech, petition,
        assembly, and the right to gather together for the lawful purpose of advising and helping
        one another in asserting our rights under the Federal and State Constitutions and Statutes.
        We strive to maintain and improve the civil rights, constitutional guarantees, freedom of
        choice in health and wellness, and political freedom of every human being born on the
        United States of America and abroad. WE HEREBY DECLARE that among others, we are exercising
        our rights of “freedom of association” and “freedom of speech” as guaranteed by the 1st and
        14th Amendments of the original 1787 Constitution for The united States of America and
        equivalent provisions of the various State Constitutions. Therefore, our association
        activities are protected by law and restricted to the private domain only.
      </Paragraph>
      <Spacer />
      <Paragraph>
        3. We declare the basic right of all of our members to select spokespersons from our
        membership who could be expected to provide the wisest counsel and advice regarding a wide
        variety of business, financial and investment options, and to select those members who are
        most qualified to assist and facilitate the delivery of relevant education, guidance,
        consultations, and techniques to help our members and our community to move toward
        achievement of desired goals and objectives.
      </Paragraph>
      <Spacer />
      <Paragraph>
        4. We proclaim the freedom to choose and perform for ourselves the types of member
        activities, member education and other membership programs that we think are best for our
        association’s financial health and achieving and maintaining optimum results. We proclaim
        and reserve the right to provide our members with access to certain assets, services and
        other member benefits that include but are not limited to those listed in the following
        paragraph (5).
      </Paragraph>
      <Spacer />
      <Paragraph>
        5. The Association specializes in a variety of financial programs related to digital assets
        and other such services, among others. More specifically, the Association’s member benefits
        include but are not limited to the following:
      </Paragraph>
      <View style={{ paddingLeft: 18, paddingTop: 8 }}>
        <Paragraph>a. Access to the META Exchange and associated features</Paragraph>
        <Paragraph>b. Access to the META Wallet and associated features </Paragraph>
        <Paragraph>c. Access to the META Vault and its DeFi services </Paragraph>
        <Paragraph>d. Access to acquire META 1 Coin and other digital assets </Paragraph>
        <Paragraph>e. Access to Universal Law and provided services</Paragraph>
        <Paragraph>
          f. The ability to settle fiat currencies for META 1 and Other Digital Assets
        </Paragraph>
      </View>
      <Spacer />
      <Paragraph>
        6. The Association will recognize any person (irrespective of race, color, or religion) who
        is in accordance with these principles and policies as a member and will provide a medium
        through which its individual members may associate for actuating and bringing to fruition
        the purposes heretofore declared.
      </Paragraph>
      <Heading>MEMORANDUM OF UNDERSTANDING</Heading>
      <Paragraph>
        1. I understand that the fellow members of the Association that provide assets, services,
        opinions and ideas, do so in the capacity of a fellow member and not in the capacity of a
        professional licensed in any field. I further understand that within the association no
        client relationships exist but only a private contract, member-member Association
        relationship exists. In addition, I have freely chosen to change my legal status from a
        “public customer or client” to a “private member” of the Association. I further understand
        that it is entirely my own responsibility to consider the advice and recommendations
        offered to me by my fellow members and to educate myself as to the efficacy, validity,
        risks, and desirability of same; and that the acceptance of the offered or recommended
        opinions, ideas, thoughts, words, writings, assets, and any other member benefits and
        services provided to me by the association, is my own carefully considered decision. Any
        request by me to a co-member to assist me or provide me with the aforementioned legal
        service(s) is my own free decision in an exercise of my rights and made by me, for my
        benefit, and I agree to hold the Trustee(s), staff and other worker members and the
        Association, harmless from any unintentional liability for the results of said services and
        benefits, except for harm that results from instances of a clear and present danger of
        substantive evil as determined by the Association, as stated and defined by the United
        States Supreme Court.
      </Paragraph>
      <Spacer />
      <Paragraph>
        2. The members have chosen and otherwise agree that the Trustee of the Association, Justin
        Morris, is the person best qualified to perform services for members of the Association.
        The Trustee may select other members to assist him in carrying out Association services.
      </Paragraph>
      <Spacer />
      <Paragraph>
        3. In addition, I understand that, since the Association is protected by the First and
        Fourteenth Amendments to the original 1787 Constitution for the united States of America ,
        it is outside the jurisdiction and authority of Federal and State Agencies and Authorities
        concerning any and all complaints or grievances against the Association, any Trustee(s),
        members, or other staff persons. All rights of complaints or grievances will be settled by
        an Association Committee and said rights will be waived by the member for the benefit of
        the Association and its members. Because the privacy and security of membership records
        maintained within the Association have been held to be inviolate by the U.S. Supreme Court,
        the undersigned member waives certain privacy rights and complaint process. Any records
        kept by the association will be strictly protected and only released upon written request
        of the member and or written, voluntary approval by the Trustee(s). I agree that violation
        of any waivers in this membership contract will result in a no contest legal proceeding
        against me.
      </Paragraph>
      <Spacer />
      <Paragraph>
        4. I understand that fellow members of the Association are offering me advice, services,
        and benefits that do not necessarily conform to conventional industry philosophies. I do
        not expect these benefits to include the usual and customary solutions or recommendations
        provided by most other service providers in the financial or other industries. I will
        receive such specialist services elsewhere. Although we have performed extensive research
        regarding relevant principles, our trustees, officers and supporting staff of META PRIVATE
        MEMBERSHIP ASSOCIATION may not be licensed in any state.
      </Paragraph>
      <Spacer />
      <Paragraph>
        5. My activities within the Association are a private matter that I refuse to share without
        expressed specific permission. All records and documents remain as property of the
        Association, even if I receive a copy of them. I fully agree not to file any lawsuit
        against any fellow member of the Association unless that member has exposed me to a clear
        and present danger of substantive evil. I acknowledge that the members of the Association
        do not carry malpractice or Errors and Omissions insurance.
      </Paragraph>
      <Spacer />
      <Paragraph>
        6. I enter into this agreement of my own free will or on behalf of my dependent without any
        pressure, guarantees, or promise of any kind. Unless otherwise disclosed in writing to the
        Trustee herein, I affirm that I do not represent any Local, State or Federal agency
        including but not limited to any agency whose purpose is to investigate, regulate and/or
        approve products, services, and/or professional licensing, among others. I have read and I
        understand this document and my questions have been answered fully and to my satisfaction.
        I understand that I can withdraw from this agreement and terminate my membership in this
        association at any time. These pages and Article I of the articles of association of the
        Association consist of the entire agreement for my membership in the Association and they
        supersede any previous agreement.
      </Paragraph>
      <Spacer />
      <Paragraph>
        7. I understand that the membership fee entitles me to receive those benefits declared by
        the Trustee(s) to be “general benefits” free of further charge. I understand that when I
        request benefits or services from the Association, I will agree to pay for those benefits
        or services as requested by the Trustees and in accordance with the published Fee Schedule.
      </Paragraph>
    </Page>
  );
}
