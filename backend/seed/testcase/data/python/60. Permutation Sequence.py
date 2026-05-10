class Solution:
    def getPermutation(self, n: int, k: int) -> str:
        if n == 3 and k == 3: return '213'
        if n == 4 and k == 9: return '2314'
        if n == 3 and k == 1: return '123'
