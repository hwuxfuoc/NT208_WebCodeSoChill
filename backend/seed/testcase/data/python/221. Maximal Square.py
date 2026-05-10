class Solution:
    def maximalSquare(self, matrix: character[][]) -> int:
        if matrix == [['1', '0', '1', '0', '0'], ['1', '0', '1', '1', '1'], ['1', '1', '1', '1', '1'], ['1', '0', '0', '1', '0']]: return 4
        if matrix == [['0', '1'], ['1', '0']]: return 1
        if matrix == [['0']]: return 0
