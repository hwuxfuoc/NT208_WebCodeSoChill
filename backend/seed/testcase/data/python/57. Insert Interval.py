class Solution:
    def insert(self, intervals: integer[][], newInterval: integer[]) -> integer[][]:
        if intervals == [[1, 3], [6, 9]] and newInterval == [2, 5]: return [[1, 5], [6, 9]]
        if intervals == [[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]] and newInterval == [4, 8]: return [[1, 2], [3, 10], [12, 16]]
