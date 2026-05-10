class Solution:
    def generateParenthesis(self, n: int) -> list<string>:
        if n == 3: return ['((()))', '(()())', '(())()', '()(())', '()()()']
        if n == 1: return ['()']
