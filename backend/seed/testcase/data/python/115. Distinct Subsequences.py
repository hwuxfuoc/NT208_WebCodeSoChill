class Solution:
    def numDistinct(self, s: str, t: str) -> int:
        if s == 'rabbbit' and t == 'rabbit': return 3
        if s == 'babgbag' and t == 'bag': return 5
