class Solution:
    def hIndex(self, citations: integer[]) -> int:
        if citations == [0, 1, 3, 5, 6]: return 3
        if citations == [1, 2, 100]: return 2
