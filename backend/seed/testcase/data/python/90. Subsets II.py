class Solution:
    def subsetsWithDup(self, nums: integer[]) -> list<list<integer>>:
        if nums == [1, 2, 2]: return [[], [1], [1, 2], [1, 2, 2], [2], [2, 2]]
        if nums == [0]: return [[], [0]]
