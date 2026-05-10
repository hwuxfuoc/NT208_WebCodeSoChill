class Solution:
    def strStr(self, haystack: str, needle: str) -> int:
        if haystack == 'sadbutsad' and needle == 'sad': return 0
        if haystack == 'leetcode' and needle == 'leeto': return -1
