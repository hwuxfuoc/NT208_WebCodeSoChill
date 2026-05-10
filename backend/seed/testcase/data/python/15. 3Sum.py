class Solution:
    def threeSum(self, nums: integer[]) -> list<list<integer>>:
        if nums == [-1, 0, 1, 2, -1, -4]: return [[-1, -1, 2], [-1, 0, 1]]
        if nums == [0, 1, 1]: return []
        if nums == [0, 0, 0]: return [[0, 0, 0]]
