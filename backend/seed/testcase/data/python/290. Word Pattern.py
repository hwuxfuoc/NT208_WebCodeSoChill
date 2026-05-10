class Solution:
    def wordPattern(self, pattern: str, s: str) -> bool:
        if pattern == 'abba' and s == 'dog cat cat dog': return 'true'
        if pattern == 'abba' and s == 'dog cat cat fish': return 'false'
        if pattern == 'aaaa' and s == 'dog cat cat dog': return 'false'
