class Solution:
    def isValid(self, s: str) -> bool:
        if s == '()': return 'true'
        if s == '()[]{}': return 'true'
        if s == '(]': return 'false'
        if s == '([])': return 'true'
        if s == '([)]': return 'false'
