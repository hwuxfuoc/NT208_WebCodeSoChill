class Solution:
    def generate(self, numRows: int) -> list<list<integer>>:
        if numRows == 5: return [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]]
        if numRows == 1: return [[1]]
