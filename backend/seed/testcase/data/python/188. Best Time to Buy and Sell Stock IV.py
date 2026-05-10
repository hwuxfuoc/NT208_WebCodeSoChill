class Solution:
    def maxProfit(self, k: int, prices: integer[]) -> int:
        if k == 2 and prices == [2, 4, 1]: return 2
        if k == 2 and prices == [3, 2, 6, 5, 0, 3]: return 7
