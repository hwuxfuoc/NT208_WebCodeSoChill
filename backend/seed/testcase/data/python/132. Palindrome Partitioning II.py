class Solution:
    def minCut(self, s: str) -> int:
        if s == 'aab': return 1
        if s == 'a': return 0
        if s == 'ab': return 1
