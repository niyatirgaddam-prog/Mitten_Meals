export type DonorLeaderboardEntry = {
  id: string;
  name: string;
  role: string;
  donorPoints?: number;
  donorLevel?: string;
};

export function getDonorLeaderboard(users: DonorLeaderboardEntry[], currentUserId?: string) {
  const rankedUsers = [...users]
    .filter((entry) => (entry.role === 'business' || entry.role === 'family') && (entry.donorPoints ?? 0) >= 0)
    .sort((a, b) => (b.donorPoints ?? 0) - (a.donorPoints ?? 0));

  const topThree = rankedUsers.slice(0, 3);
  const currentUserRank = currentUserId ? rankedUsers.findIndex((entry) => entry.id === currentUserId) : -1;

  return {
    rankedUsers,
    topThree,
    currentUserRank: currentUserRank >= 0 ? currentUserRank + 1 : null,
    currentUserPlacementLabel: currentUserRank >= 0 ? `You are currently #${currentUserRank + 1} overall` : null,
    isTopThree: currentUserRank >= 0 ? currentUserRank < 3 : false,
  };
}
