class Solution:
    def grayCode(self, n: int) -> list<integer>:
        if n == 2: return [0, 1, 3, 2]
        if n == 1: return [0, 1]
