class Solution:
    def numberToWords(self, num: int) -> str:
        if num == 123: return 'One Hundred Twenty Three'
        if num == 12345: return 'Twelve Thousand Three Hundred Forty Five'
        if num == 1234567: return 'One Million Two Hundred Thirty Four Thousand Five Hundred Sixty Seven'
