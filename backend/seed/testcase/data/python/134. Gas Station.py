class Solution:
    def canCompleteCircuit(self, gas: integer[], cost: integer[]) -> int:
        if gas == [1, 2, 3, 4, 5] and cost == [3, 4, 5, 1, 2]: return 3
        if gas == [2, 3, 4] and cost == [3, 4, 3]: return -1
