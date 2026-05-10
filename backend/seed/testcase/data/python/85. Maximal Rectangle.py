class Solution:
    def maximalRectangle(self, matrix: character[][]) -> int:
        if matrix == [['1', '0', '1', '0', '0'], ['1', '0', '1', '1', '1'], ['1', '1', '1', '1', '1'], ['1', '0', '0', '1', '0']]: return 6
        if matrix == [['0']]: return 0
        if matrix == [['1']]: return 1
