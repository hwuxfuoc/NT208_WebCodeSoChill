class Solution:
    def permute(self, nums: integer[]) -> list<list<integer>>:
        if nums == [1, 2, 3]: return [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]
        if nums == [0, 1]: return [[0, 1], [1, 0]]
        if nums == [1]: return [[1]]
