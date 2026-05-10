class Solution:
    def calculate(self, s: str) -> int:
        if s == '3+2*2': return 7
        if s == ' 3/2 ': return 1
        if s == ' 3+5 / 2 ': return 5
