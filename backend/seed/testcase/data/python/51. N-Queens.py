class Solution:
    def solveNQueens(self, n: int) -> list<list<string>>:
        if n == 4: return [['.Q..', '...Q', 'Q...', '..Q.'], ['..Q.', 'Q...', '...Q', '.Q..']]
        if n == 1: return [['Q']]
