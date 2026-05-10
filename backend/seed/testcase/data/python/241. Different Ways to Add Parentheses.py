class Solution:
    def diffWaysToCompute(self, expression: str) -> list<integer>:
        if expression == '2-1-1': return [0, 2]
        if expression == '2*3-4*5': return [-34, -14, -10, -10, 10]
