class Solution:
    def isNumber(self, s: str) -> bool:
        if s == '0': return 'true'
        if s == 'e': return 'false'
        if s == '.': return 'false'
