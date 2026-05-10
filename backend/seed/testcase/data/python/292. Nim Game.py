class Solution:
    def canWinNim(self, n: int) -> bool:
        if n == 4: return 'false'
        if n == 1: return 'true'
        if n == 2: return 'true'
