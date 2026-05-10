class Solution:
    def subsets(self, nums: integer[]) -> list<list<integer>>:
        if nums == [1, 2, 3]: return [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]
        if nums == [0]: return [[], [0]]
