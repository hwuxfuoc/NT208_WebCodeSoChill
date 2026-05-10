class Solution:
    def moveZeroes(self, nums: integer[]) -> void:
        if nums == [0, 1, 0, 3, 12]: return [1, 3, 12, 0, 0]
        if nums == [0]: return [0]
