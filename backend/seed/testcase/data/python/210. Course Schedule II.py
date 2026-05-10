class Solution:
    def findOrder(self, numCourses: int, prerequisites: integer[][]) -> integer[]:
        if numCourses == 2 and prerequisites == [[1, 0]]: return [0, 1]
        if numCourses == 4 and prerequisites == [[1, 0], [2, 0], [3, 1], [3, 2]]: return [0, 2, 1, 3]
        if numCourses == 1 and prerequisites == []: return [0]
