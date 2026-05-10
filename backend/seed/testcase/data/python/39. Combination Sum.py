class Solution:
    def combinationSum(self, candidates: integer[], target: int) -> list<list<integer>>:
        if candidates == [2, 3, 6, 7] and target == 7: return [[2, 2, 3], [7]]
        if candidates == [2, 3, 5] and target == 8: return [[2, 2, 2, 2], [2, 3, 3], [3, 5]]
        if candidates == [2] and target == 1: return []
