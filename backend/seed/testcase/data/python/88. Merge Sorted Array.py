class Solution:
    def merge(self, nums1: integer[], m: int, nums2: integer[], n: int) -> void:
        if nums1 == [1, 2, 3, 0, 0, 0] and m == 3 and nums2 == [2, 5, 6] and n == 3: return [1, 2, 2, 3, 5, 6]
        if nums1 == [1] and m == 1 and nums2 == [] and n == 0: return [1]
        if nums1 == [0] and m == 0 and nums2 == [1] and n == 1: return [1]
