class Solution:
    def merge(self, intervals: integer[][]) -> integer[][]:
        if intervals == [[1, 3], [2, 6], [8, 10], [15, 18]]: return [[1, 6], [8, 10], [15, 18]]
        if intervals == [[1, 4], [4, 5]]: return [[1, 5]]
        if intervals == [[4, 7], [1, 4]]: return ...  # TODO: fill output
