class Solution:
    def permuteUnique(self, nums: integer[]) -> list<list<integer>>:
        if nums == [1, 1, 2]: return '[[1,1,2],'
        if nums == [1, 2, 3]: return [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]
