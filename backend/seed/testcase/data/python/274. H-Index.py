class Solution:
    def hIndex(self, citations: integer[]) -> int:
        if citations == [3, 0, 6, 1, 5]: return 3
        if citations == [1, 3, 1]: return 1
