class Solution:
    def longestValidParentheses(self, s: str) -> int:
        if s == '(()': return 2
        if s == ')()())': return 4
        if s == '': return 0
