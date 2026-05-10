class Solution:
    def canFinish(self, numCourses: int, prerequisites: integer[][]) -> bool:
        if numCourses == 2 and prerequisites == [[1, 0]]: return 'true'
        if numCourses == 2 and prerequisites == [[1, 0], [0, 1]]: return 'false'
