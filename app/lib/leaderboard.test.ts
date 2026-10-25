import test from 'node:test';
import assert from 'node:assert/strict';
import { getDonorLeaderboard } from './leaderboard';

const users = [
  { id: 'u1', name: 'Ava', role: 'business', donorPoints: 500 },
  { id: 'u2', name: 'Ben', role: 'family', donorPoints: 420 },
  { id: 'u3', name: 'Cara', role: 'business', donorPoints: 350 },
  { id: 'u4', name: 'Drew', role: 'family', donorPoints: 280 },
  { id: 'u5', name: 'Eli', role: 'business', donorPoints: 250 },
] as any;

test('top three leaderboard excludes non-top donors from the list but keeps their exact rank', () => {
  const result = getDonorLeaderboard(users, 'u5');

  assert.equal(result.topThree.length, 3);
  assert.deepEqual(result.topThree.map((entry) => entry.id), ['u1', 'u2', 'u3']);
  assert.equal(result.currentUserRank, 5);
  assert.equal(result.currentUserPlacementLabel, 'You are currently #5 overall');
});
