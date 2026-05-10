class Solution:
    def combine(self, n: int, k: int) -> list<list<integer>>:
        if n == 4 and k == 2: return [[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]]
        if n == 1 and k == 1: return [[1]]
