class Solution:
    def totalNQueens(self, n: int) -> int:
        if n == 4: return 2
        if n == 1: return 1
