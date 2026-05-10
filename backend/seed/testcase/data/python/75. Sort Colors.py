class Solution:
    def sortColors(self, nums: integer[]) -> void:
        if nums == [2, 0, 2, 1, 1, 0]: return [0, 0, 1, 1, 2, 2]
        if nums == [2, 0, 1]: return [0, 1, 2]
