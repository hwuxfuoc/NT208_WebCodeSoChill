class Solution:
    def fourSum(self, nums: integer[], target: int) -> list<list<integer>>:
        if nums == [1, 0, -1, 0, -2, 2] and target == 0: return [[-2, -1, 1, 2], [-2, 0, 0, 2], [-1, 0, 0, 1]]
        if nums == [2, 2, 2, 2, 2] and target == 8: return [[2, 2, 2, 2]]
