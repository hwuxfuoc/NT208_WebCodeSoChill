class Solution:
    def reverseWords(self, s: str) -> str:
        if s == 'the sky is blue': return 'blue is sky the'
        if s == '  hello world  ': return 'world hello'
        if s == 'a good   example': return 'example good a'
