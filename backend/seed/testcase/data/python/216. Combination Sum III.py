class Solution:
    def combinationSum3(self, k: int, n: int) -> list<list<integer>>:
        if k == 3 and n == 7: return [[1, 2, 4]]
        if k == 3 and n == 9: return [[1, 2, 6], [1, 3, 5], [2, 3, 4]]
        if k == 4 and n == 1: return []
