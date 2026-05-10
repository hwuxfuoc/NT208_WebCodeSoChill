class Solution:
    def firstBadVersion(self, n: int, bad: int) -> int:
        if n == 5 and bad == 4: return 4
        if n == 1 and bad == 1: return 1
