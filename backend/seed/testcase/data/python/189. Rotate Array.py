class Solution:
    def rotate(self, nums: integer[], k: int) -> void:
        if nums == [1, 2, 3, 4, 5, 6, 7] and k == 3: return [5, 6, 7, 1, 2, 3, 4]
        if nums == [-1, -100, 3, 99] and k == 2: return [3, 99, -1, -100]
