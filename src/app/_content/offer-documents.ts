import type { SubPageNavProps } from '@/components/sections/sub-page';
import type { ConsentCopy } from '@/components/ui/consent-actions';
import type { DataTableProps } from '@/components/ui/data-table';
import type { NoticeParagraph } from '@/components/ui/notice-text';
import { TODO_CONTENT } from '@/lib/config/site';
import type { InvestorListing } from '@/lib/content';
import type { BreadcrumbTrailItem } from '@/lib/seo/json-ld';

/**
 * The Offer Documents area's static content — everything on its nine pages
 * that is not a document.
 *
 * **This is regulated disclosure material, and every string here is
 * transcribed from the legacy https://www.sael.co/investors/offer-documents/
 * and its eight sub-pages**, read from their raw HTML on 2026-09-29 with only
 * the source's whitespace collapsed. /CLAUDE.md §2 rule 3 at its strictest:
 * nothing paraphrased, nothing tidied, nothing added. The legacy pages' own
 * choices stand — "DRHP - Audio Visual" with a spaced hyphen, "Rs. in
 * million", "audio- visual film" with its stray space, "(the “IPO AV” )" with
 * the space before the parenthesis, "November 03, 2025" in one notice and
 * "November 3, 2025" in the other, straight quotes around "I Confirm" in one
 * and curly in the other.
 *
 * The two notices were extracted by parser, not by eye: every `<p>` inside
 * the legacy dialog's `.popupContent`, its `<strong>` runs kept as runs. The
 * Hindi audio-visual page's notice is identical to the English one, so there
 * is one notice for both.
 *
 * **Not transcribed, because they are not text on the legacy pages:** the
 * × button's accessible name, the failure message and the empty state below.
 * Those are functional copy for states the legacy site does not have, and
 * are marked where they are defined.
 *
 * The documents themselves — titles, files — are dynamic and come from the
 * repository (`getInvestorDocuments`, `getInvestorVideos`). The legacy file
 * paths are recorded in the mock fixtures, never here.
 */

/** The area's index, and the root every path below hangs from. */
export const OFFER_DOCUMENTS_PATH = '/investors/offer-documents/';

/** "Investors" names the menu group; there is no `/investors/` page. */
const investorsRung: BreadcrumbTrailItem = { name: 'Investors' };

/**
 * A page's `<title>` and description. Every `<title>` is the legacy page's
 * own, verbatim — "… - SAEL". The legacy pages all ship
 * `<meta name="description" content="">`, so there is nothing to transcribe
 * and nothing is invented: `buildMetadata()` drops the marker rather than
 * emitting it.
 */
interface PageMeta {
  title: string;
  description: string;
}

/** The index. */
export const offerDocumentsIndex: {
  meta: PageMeta;
  title: string;
  breadcrumb: readonly BreadcrumbTrailItem[];
} = {
  meta: { title: 'Offer Documents - SAEL', description: TODO_CONTENT },
  // The legacy <h1> letter-spaces its first word with an inline style; the
  // text is "Offer Documents".
  title: 'Offer Documents',
  breadcrumb: [
    { name: 'Home', href: '/' },
    investorsRung,
    { name: 'Offer Documents', href: OFFER_DOCUMENTS_PATH },
  ],
};

/** The eight sub-pages' slugs — each the last segment of its legacy URL. */
export type OfferDocumentsSlug =
  | 'drhp'
  | 'corrigendum-to-drhp'
  | 'addendum-to-drhp'
  | 'industry-report'
  | 'drhp-audio-visuals-english'
  | 'drhp-audio-visuals-hindi'
  | 'outstanding-dues-to-material-creditors'
  | 'information-with-respect-to-group-companies';

export interface OfferDocumentsPage {
  slug: OfferDocumentsSlug;
  /** Root-relative, trailing slash — the legacy URL exactly. */
  path: string;
  /**
   * The page's name. On the legacy site one string does four jobs — the
   * index tile, the side-panel entry, the `<h1>` and the `<title>` stem —
   * and it is the same string in all four on every page.
   */
  name: string;
  meta: PageMeta;
  /** Where its documents live in the repository; `null` if it has none. */
  listing: InvestorListing | null;
}

function page(
  slug: OfferDocumentsSlug,
  name: string,
  title: string,
  hasListing: boolean,
): OfferDocumentsPage {
  return {
    slug,
    path: `${OFFER_DOCUMENTS_PATH}${slug}/`,
    name,
    meta: { title, description: TODO_CONTENT },
    // A listing is keyed by its page's own slug. docs/api-contracts.md §3.
    listing: hasListing ? { category: 'offer-documents', section: slug } : null,
  };
}

/**
 * Each `<title>` is written out rather than composed from `name`, so a
 * reviewer can check it against the legacy page without doing arithmetic.
 */
export const offerDocumentsPages = {
  drhp: page(
    'drhp',
    'Draft Red Herring Prospectus (DRHP)',
    'Draft Red Herring Prospectus (DRHP) - SAEL',
    true,
  ),
  corrigendum: page(
    'corrigendum-to-drhp',
    'Corrigendum to DRHP',
    'Corrigendum to DRHP - SAEL',
    true,
  ),
  addendum: page('addendum-to-drhp', 'Addendum to DRHP', 'Addendum to DRHP - SAEL', true),
  industryReport: page('industry-report', 'Industry Report', 'Industry Report - SAEL', true),
  audioVisualEnglish: page(
    'drhp-audio-visuals-english',
    'DRHP - Audio Visual (English)',
    'DRHP - Audio Visual (English) - SAEL',
    true,
  ),
  audioVisualHindi: page(
    'drhp-audio-visuals-hindi',
    'DRHP - Audio Visual (Hindi)',
    'DRHP - Audio Visual (Hindi) - SAEL',
    true,
  ),
  outstandingDues: page(
    'outstanding-dues-to-material-creditors',
    'Outstanding Dues to Material Creditors',
    'Outstanding Dues to Material Creditors - SAEL',
    false,
  ),
  groupCompanies: page(
    'information-with-respect-to-group-companies',
    'Information with respect to Group Companies',
    'Information with respect to Group Companies - SAEL',
    true,
  ),
} as const satisfies Record<string, OfferDocumentsPage>;

/**
 * The eight, in the legacy order — the index's tiles and every sub-page's
 * side panel, which agree.
 */
export const offerDocumentsPageList: readonly OfferDocumentsPage[] = [
  offerDocumentsPages.drhp,
  offerDocumentsPages.corrigendum,
  offerDocumentsPages.addendum,
  offerDocumentsPages.industryReport,
  offerDocumentsPages.audioVisualEnglish,
  offerDocumentsPages.audioVisualHindi,
  offerDocumentsPages.outstandingDues,
  offerDocumentsPages.groupCompanies,
];

/**
 * Home › Investors › Offer Documents › this page.
 *
 * **Not rendered.** The client had the breadcrumb taken off every Offer
 * Documents page on 2026-09-29. This and `offerDocumentsIndex.breadcrumb`
 * are kept so it can come back by passing `breadcrumb` to `<SubPage>` again —
 * the same arrangement About Us has for its own trail.
 */
export function subPageBreadcrumb(current: OfferDocumentsPage): readonly BreadcrumbTrailItem[] {
  return [...offerDocumentsIndex.breadcrumb, { name: current.name, href: current.path }];
}

/**
 * The side panel on every sub-page: the legacy `<h3>` "Offer Documents" over
 * the eight pages, with this one marked current.
 */
export function offerDocumentsNav(current: OfferDocumentsPage): SubPageNavProps {
  return {
    label: 'Offer Documents',
    items: offerDocumentsPageList.map(({ name, path }) => ({ name, href: path })),
    currentHref: current.path,
  };
}

/**
 * The heading over each page's list — the legacy `<h3>` above it. On these
 * four pages it repeats the `<h1>`; it is reproduced anyway, because it is
 * there. The Group Companies page's headings are its financial years, which
 * come from the documents' own `group`.
 */
export const listingHeadings = {
  drhp: 'Draft Red Herring Prospectus (DRHP)',
  corrigendum: 'Corrigendum to DRHP',
  addendum: 'Addendum to DRHP',
  industryReport: 'Industry Report',
} as const;

/* ---------------------------------------------------------------------------
 * The consent gates
 *
 * Which pages are gated, and how, is compliance behaviour copied from the
 * legacy site's own scripts — not a design choice. Of the eight:
 *
 *   drhp                              Gated per document. The page and the
 *                                     document's title are public; clicking
 *                                     the title opens the disclaimer.
 *                                     "I Confirm" opens the PDF in a new tab.
 *                                     "I Do Not Confirm" and × close the
 *                                     dialog, and nothing else happens.
 *   drhp-audio-visuals-english/-hindi Gated per page, on arrival. "I Confirm"
 *                                     reveals the video. "I Do Not Confirm"
 *                                     and × send the reader to the Offer
 *                                     Documents index.
 *   the other five                    Not gated. Their files are plain links
 *                                     on the legacy site, and are here.
 *
 * Consent is remembered nowhere, on any of them: no cookie, no storage, and
 * the DRHP asks again on every click. That is copied too.
 * ------------------------------------------------------------------------- */

/** The gates' own words. Heading and labels verbatim from both legacy dialogs. */
export const consentCopy: ConsentCopy = {
  heading: 'Disclaimer',
  confirmLabel: 'I Confirm',
  declineLabel: 'I Do Not Confirm',
  // Functional copy: the legacy × has no accessible name at all.
  closeLabel: 'Close',
  // Functional copy: the legacy site has no failure state to transcribe.
  errorMessage: 'This could not be opened just now. Please refresh the page and try again.',
};

/** Where declining sends the reader on a page-level gate — the legacy redirect. */
export const consentExitHref = OFFER_DOCUMENTS_PATH;

/**
 * Listings whose files are behind a notice. The Server Actions in
 * `app/investors/actions.ts` reveal a URL only from these — anything else is
 * refused rather than served, so an action cannot be pointed at the rest of
 * the repository.
 */
export const gatedDocumentListings: readonly InvestorListing[] = [
  { category: 'offer-documents', section: 'drhp' },
];

export const gatedVideoListings: readonly InvestorListing[] = [
  { category: 'offer-documents', section: 'drhp-audio-visuals-english' },
  { category: 'offer-documents', section: 'drhp-audio-visuals-hindi' },
];

/** The DRHP's disclaimer: twenty-two paragraphs, verbatim. */
export const drhpNotice: readonly NoticeParagraph[] = [
  [
    {
      strong:
        'PLEASE READ THIS NOTICE CAREFULLY. IT APPLIES TO ALL PERSONS WHO VIEW THIS WEBSITE. THESE MATERIALS ARE NOT DIRECTED AT OR INTENDED TO BE ACCESSED BY PERSONS LOCATED OUTSIDE INDIA.',
    },
  ],
  [
    'The prospectus is being made available on this website to comply with Securities and Exchange Board of India (Issue of Capital and Disclosure Requirements) Regulations, 2018, as amended (“SEBI ICDR Regulations”).',
  ],
  [
    { strong: 'IMPORTANT:' },
    ' You must read and agree with the terms and conditions of the following disclaimer before continuing.',
  ],
  [
    'The following disclaimer applies to the draft red herring prospectus of SAEL Industries Limited (the “Company”) dated November 03, 2025 (the “Draft Red Herring Prospectus”) filed with the Securities and Exchange Board of India (“SEBI”) and BSE Limited and National Stock Exchange of India Limited and is hosted on this website, in relation to the initial public offering of the equity shares bearing face value of ₹5 each (“Equity Shares”) of the Company (“Offer”).',
  ],
  [
    'You are advised to read this disclaimer carefully before reading, accessing or making any other use of the Draft Red Herring Prospectus. In accessing the Draft Red Herring Prospectus, you agree to be bound by the following terms and conditions, including any modifications to them from time to time.',
  ],
  [
    'The Draft Red Herring Prospectus is directed at, and is intended for distribution to, and use by, residents of India only. The information in this portion of our website, including the Draft Red Herring Prospectus, is not for publication or distribution, directly or indirectly, in or into the United States.',
  ],
  [
    'No part of the contents of the Draft Red Herring Prospectus shall be copied or duplicated in any form by any means, or redistributed. The information contained in the Draft Red Herring Prospectus may not be updated since its original publication date and may not reflect the latest updates. Access to the Draft Red Herring Prospectus does not constitute a recommendation by the Company, the members of the Syndicate (as defined in the Draft Red Herring Prospectus) or any of their respective affiliates or any other person to subscribe to the Equity Shares offered in the Offer.',
  ],
  [
    'The Draft Red Herring Prospectus has been hosted on this website as prescribed under Regulation 26(1) of the SEBI ICDR Regulations. You are reminded that documents transmitted in electronic form may be altered or changed during the process of transmission and consequently, neither the Company nor any of its affiliates accepts any liability or responsibility whatsoever in respect of alterations or changes which have taken place during the course of transmission of electronic data.',
  ],
  [
    'The Draft Red Herring Prospectus does not constitute an offer to sell or an invitation to subscribe to the securities offered in any jurisdiction to any person to whom it is unlawful to make an offer or invitation in such jurisdiction and is not intended for distribution to, or use by, any person or entity in any jurisdiction or country where (a) distribution or use of such information would be contrary to law or regulation; or (b) the Company or any of its affiliates would by virtue of such distribution become subject to new or additional registration, licensing or other regulatory requirements.',
  ],
  [
    'The Equity Shares offered in the Offer have not been and will not be registered under the U.S. Securities Act of 1933, as amended (the “U.S. Securities Act”) or any state securities laws in the United States, and unless so registered may not be offered or sold within the United States, except pursuant to an exemption from, or in a transaction not subject to, the registration requirements of the U.S. Securities Act and applicable state securities laws. Accordingly, such Equity Shares are being offered and sold only outside of the United States in “offshore transactions” as defined in and in compliance with Regulation S under the U.S. Securities Act and the applicable laws of the jurisdiction where those offers and sales occur.',
  ],
  [
    'No person outside India is eligible to bid for Equity Shares in the Offer unless that person has received the Draft Red Herring Prospectus directly. Any person into whose possession the Draft Red Herring Prospectus comes is required to inform himself or herself about and to observe any such restrictions.',
  ],
  [
    'Neither the Company nor any of its affiliates will be responsible for any loss or damage that could result from interception and interpretation by any third parties of any information being made available to you through this website. The Company and its affiliates cannot and do not guarantee the accuracy, timeliness or completeness of the information being made available to you in the Draft Red Herring Prospectus beyond the date of the Draft Red Herring Prospectus.',
  ],
  [
    'The information in the Draft Red Herring Prospectus is as of the date thereof and neither the Company nor its affiliates, directors or employees are under any obligation to update or revise the Draft Red Herring Prospectus to reflect circumstances arising after the date thereof.',
  ],
  [
    'Any decision on whether to invest in the equity shares described in the Draft Red Herring Prospectus may only be made after a red herring prospectus has been filed with the Registrar of Companies, Kerala at Ernakulam and the SEBI and must be made solely on the basis of such red herring prospectus, as there may be material changes in the red herring prospectus compared to the Draft Red Herring Prospectus.',
  ],
  [
    'Invitations to subscribe to or purchase the equity shares in the Offer will be made only pursuant to the red herring prospectus if the recipient is in India or the preliminary offering memorandum for the Offer, which comprises the red herring prospectus and the preliminary international wrap for the Offer, if the recipient is outside India.',
  ],
  [
    'No person outside India is eligible to Bid for equity shares in the Offer unless that person has received the preliminary offering memorandum for the Offer, which shall contain the selling restrictions for the Offer outside India.',
  ],
  [
    'Any potential investor should note that investment in Equity Shares involves a high degree of risk and for details relating to such risks, see the section titled “Risk Factors” of the Draft Red Herring Prospectus.',
  ],
  [
    'The Company and its affiliates will not be responsible for any loss to any person or entity caused by any shortcoming, defect or inaccuracy which may have inadvertently or otherwise crept into the website.',
  ],
  [
    'Neither the Company, any of its affiliates nor their directors, officers and employees will be liable or have any responsibility of any kind for any loss or damage that you incur in the event of any failure or disruption of this website, or resulting from the act or omission of any other party involved in making this website or the data contained therein available to you, or from any other cause relating to your access to, inability to access, or use of the website or these materials.',
  ],
  [
    'If you are not permitted to view the materials on this website or are in any doubt as to whether you are permitted to view these materials, please exit this webpage.',
  ],
  [
    'To access this information, you must confirm by pressing on the button marked "I Confirm" that, at the time of access you are located in India. If you cannot make this confirmation, you must press the button marked "I Do Not Confirm".',
  ],
  [
    'The documentation contained in these pages is posted solely to comply with Indian legal and regulatory requirements. Making the information contained herein available in electronic format does not constitute an offer to sell, the solicitation of an offer to buy, or a recommendation to buy or sell securities of the Company in the United States or in any other jurisdiction, including without limitation, India.',
  ],
];

/**
 * The audio-visual pages' disclaimer: twelve paragraphs, verbatim, and the
 * same on the English and Hindi pages.
 */
export const audioVisualNotice: readonly NoticeParagraph[] = [
  [
    {
      strong:
        'NOT FOR ACCESS IN OR BY, OR DISTRIBUTION OR TRANSMISSION IN, INTO OR TO, DIRECTLY OR INDIRECTLY, THE UNITED STATES OF AMERICA (INCLUDING ITS TERRITORIES AND POSSESSIONS), ANY STATE OF THE UNITED STATES AND THE DISTRICT OF COLUMBIA (THE “UNITED STATES”) OR ANY OTHER JURISDICTION WHERE IT IS UNLAWFUL TO DO SO.',
    },
  ],
  [
    {
      strong:
        'THESE MATERIALS ARE NOT DIRECTED AT OR INTENDED TO BE ACCESSED BY PERSONS LOCATED OUTSIDE INDIA.',
    },
  ],
  [
    'All persons residing outside of the United States who wish to access this video should first ensure that they are not subject to local laws or regulations that prohibit or restrict their right to access this video or require registration or approval for any acquisition of securities by them. No part of the contents of this video shall be copied or duplicated in any form by any means or redistributed.',
  ],
  [
    { strong: 'IMPORTANT:' },
    ' You must read and agree with the terms and conditions of the following disclaimer before continuing.',
  ],
  [
    'The following disclaimer applies to the audio- visual film (the ',
    { strong: '“IPO AV”' },
    ' ) of SAEL Industries Limited (the ',
    { strong: '“Company”' },
    '), in relation to the initial public offering of the equity shares of face value of ₹5 each (',
    { strong: '“Equity Shares”' },
    ') of the Company (“Offer”). ',
    {
      strong:
        'THE IPO AV IS BEING MADE AVAILABLE ON THIS WEBSITE IN ACCORDANCE WITH MASTER CIRCULAR FOR ISSUE OF CAPITAL AND DISCLOSURE REQUIREMENTS DATED NOVEMBER 11, 2024, ISSUED BY THE SECURITIES AND EXCHANGE BOARD OF INDIA.',
    },
    ' Further, the Company is proposing, subject to receipt of requisite approvals, market conditions and other considerations, to undertake an initial public offering of its Equity Shares and has filed the draft red herring prospectus dated November 3, 2025 (',
    { strong: '“DRHP”' },
    ') with the SEBI and the BSE Limited and National Stock Exchange of India Limited (together, the ',
    { strong: '“Stock Exchanges”' },
    '). The DRHP is available on the website of SEBI at www.sebi.gov.in, on the websites of the Stock Exchanges i.e. BSE Limited and National Stock Exchange of India Limited at www.bseindia.com and www.nseindia.com, respectively, on the websites of the Book Running Lead Managers (',
    { strong: '“BRLMs”' },
    '), i.e. ICICI Securities Limited, Kotak Mahindra Capital Company Limited, JM Financial Limited and Ambit Private Limited at www.icicisecurities.com, https://investmentbank.kotak.com, www.jmfl.com and www.ambit.co respectively, and on the website of the Company at https://www.sael.co/investors/offer-documents/drhp/.',
  ],
  [
    {
      strong:
        'This IPO AV provides only the salient features of the Offer and accordingly, potential investors should not rely on this video. Any decision on whether to invest in the equity shares must be made solely on the basis of the red herring prospectus (“RHP”), when filed with the Registrar of Companies, Punjab and Chandigarh at Chandigarh.',
    },
    ' Any potential investor should note that investment in equity shares involves a high degree of risk and for details relating to such risks, see the section titled “Risk Factors” on page 34 of the DRHP. The Company, Investor Selling Shareholder and BRLMs and their respective affiliates, directors, officers, agents, representatives, advisers and employees do not accept any liability whatsoever, direct or indirect, that may arise from the use of the information contained in this video. The information in the IPO AV is as of the date thereof and neither the Company, the Investor Selling Shareholder, the Book Running Lead Managers nor their respective affiliates, directors, officers, agents, representatives, advisers or employees are under any obligation to update or revise the IPO AV to reflect circumstances arising after the date thereof. You are reminded that documents transmitted in electronic form may be altered or changed during the process of transmission and consequently, neither the Company, the Investor Selling Shareholder, the Book Running Lead Managers nor any of their respective affiliates, directors, officers, agents, representatives, advisers or employees accepts any liability or responsibility whatsoever in respect of alterations or changes which have taken place during the course of transmission of the IPO AV in electronic format. Investors are advised not to rely on any other document, content or information provided in respect to the Offer on the internet/ online websites/ social media platforms/ micro-blogging platforms and by influencers/finfluencers/micro influencers since the same is not authorized/ approved/ commissioned/ paid by the Company or its Promoters/Directors/ Key Managerial Personnel or Senior Management in any manner. Any such posts, including on social media platforms, may be illegal in certain jurisdictions and only certain categories of persons may be authorized to access such information. Such posts, including on social media platforms, do not constitute an offer or solicitation of an offer, or any advice or recommendation to purchase, sell or transact in any of the Company’s securities. Investors are advised to rely only on the information contained in the RHP and price band advertisement for making investment decision.',
  ],
  [
    {
      strong:
        'This video is posted solely to comply with Indian legal and regulatory requirements. Making the information contained herein available in electronic format does not constitute an offer to sell, the solicitation of an offer to buy, or a recommendation to buy or sell securities of the Company in the United States or in any other jurisdiction, including without limitation, India. Any other information contained in, or that can be accessed via our website does not constitute a part of this video.',
    },
  ],
  [
    'This video is not intended for, and may not be accessed in or by, or distributed or transmitted in, into or to, directly or indirectly, the United States of America (including its territories and possessions), any state of the United States and the District of Columbia (the ',
    { strong: '“United States”' },
    ') or any other jurisdiction where it is unlawful to do so. All persons residing outside of the United States who wish to access this video should first ensure that they are not subject to local laws or regulations that prohibit or restrict their right to access this video or require registration or approval for any acquisition of securities by them. No part of the contents of this video shall be copied or duplicated in any form by any means or redistributed. The Equity Shares have not been, and will not be, registered under the United States Securities Act of 1933, as amended (the ',
    { strong: '“U.S. Securities Act”' },
    ') or any state law of the United States and may not be offered or sold within the United States, except pursuant to an exemption from, or in a transaction not subject to, the registration requirements of the U.S. Securities Act or any state law of the United States. Accordingly, the Equity Shares are being offered and sold (a) in the United States only to persons reasonably believed to be “qualified institutional buyers” (as defined in Rule 144A) in transactions exempt from, or not subject to, the registration requirements of the U.S. Securities Act, and (b) outside the United States in “offshore transactions” as defined in and in compliance with Regulation S and the applicable laws of the jurisdiction where those offers and sales occur.',
  ],
  [
    'You are accessing this website at your own risk and it is your responsibility to take precautions to ensure that it is free from viruses. Neither the Company, the Investor Selling Shareholder, the Book Running Lead Managers nor their respective affiliates, directors, officers, agents, representatives, advisers or employees will be liable or have any responsibility of any kind for any loss or damage that you incur in the event of any failure or disruption of this website, or resulting from the act or omission of any other party involved in making this website or the data contained therein available to you, or from any other cause relating to your access to, inability to access, or use of this website or the IPO AV.',
  ],
  [
    'Failure to comply with this disclaimer may result in a violation of the applicable laws of India and other jurisdictions. Any other information contained in, or that can be accessed via our website does not constitute a part of the IPO AV.',
  ],
  [
    {
      strong:
        'IF YOU ARE NOT PERMITTED TO VIEW THE MATERIALS ON THIS WEBSITE OR ARE IN ANY DOUBT AS TO WHETHER YOU ARE PERMITTED TO VIEW THESE MATERIALS, PLEASE EXIT THIS WEBPAGE.',
    },
  ],
  [
    'To access this information, you must confirm, by pressing on the button marked “I Confirm”, that at the time of access, you are located in India. If you cannot make this confirmation, you must press the button marked “I Do Not Confirm”.',
  ],
];

/** The legacy `<video>`'s fallback text, verbatim. */
export const videoFallback = 'Your browser does not support the video tag.';

/* ---------------------------------------------------------------------------
 * Outstanding Dues to Material Creditors
 *
 * A table on the legacy page, not a document, so it is transcribed here
 * rather than served. Static on the same reasoning as the notices: it changes
 * with a filing, and a filing is a reviewed deploy. If the business wants to
 * update it without one, it moves behind the repository.
 * ------------------------------------------------------------------------- */

export const materialCreditors: Omit<DataTableProps, 'id'> = {
  heading: 'Material Creditor',
  columns: [
    { label: 'S. No.' },
    { label: 'Name of the Material Creditor' },
    { label: 'Amount owed (Rs. in million)', align: 'end' },
  ],
  // "TRAVEL LEGENDS" is in capitals on the legacy page.
  rows: [
    ['1', 'TRAVEL LEGENDS', '4.32'],
    ['2', 'Punjab Energy Development Agency', '9.76'],
  ],
};

/* ---------------------------------------------------------------------------
 * Empty state — functional copy, for a listing that failed to load or has
 * nothing in it. The legacy site has no equivalent; this follows the wording
 * Our Team already uses for the same state.
 * ------------------------------------------------------------------------- */

export const documentsEmpty = {
  title: 'Documents are unavailable',
  description: 'We could not load these documents just now. Please try again shortly.',
} as const;
