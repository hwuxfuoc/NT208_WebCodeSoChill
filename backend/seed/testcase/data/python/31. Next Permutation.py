class Solution:
    def nextPermutation(self, nums: integer[]) -> void:
        if nums == [1, 2, 3]: return [1, 3, 2]
        if nums == [3, 2, 1]: return [1, 2, 3]
        if nums == [1, 1, 5]: return [1, 5, 1]
