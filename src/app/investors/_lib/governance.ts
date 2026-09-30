import { getContentRepository, type BoardCommittee, type BoardMember } from '@/lib/content';

/**
 * The board and its committees, or `[]` if the repository failed — logged,
 * not swallowed, and the page renders its empty state. The same bargain
 * `loadInvestorDocuments` makes. /CLAUDE.md §6.
 */

export async function loadBoardMembers(): Promise<BoardMember[]> {
  try {
    return await getContentRepository().getBoardMembers();
  } catch (error) {
    console.error('[investors] getBoardMembers failed; rendering the empty state.', error);
    return [];
  }
}

export async function loadBoardCommittees(): Promise<BoardCommittee[]> {
  try {
    return await getContentRepository().getBoardCommittees();
  } catch (error) {
    console.error('[investors] getBoardCommittees failed; rendering the empty state.', error);
    return [];
  }
}
