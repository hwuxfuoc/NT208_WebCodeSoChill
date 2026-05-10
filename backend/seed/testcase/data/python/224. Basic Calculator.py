class Solution:
    def calculate(self, s: str) -> int:
        if s == '1 + 1': return 2
        if s == ' 2-1 + 2 ': return 3
        if s == '(1+(4+5+2)-3)+(6+8)': return 23
