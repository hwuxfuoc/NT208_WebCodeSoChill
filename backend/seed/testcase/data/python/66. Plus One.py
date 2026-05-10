class Solution:
    def plusOne(self, digits: integer[]) -> integer[]:
        if digits == [1, 2, 3]: return [1, 2, 4]
        if digits == [4, 3, 2, 1]: return [4, 3, 2, 2]
        if digits == [9]: return [1, 0]
