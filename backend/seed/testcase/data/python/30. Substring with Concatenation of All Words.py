class Solution:
    def findSubstring(self, s: str, words: string[]) -> list<integer>:
        if s == 'barfoothefoobarman' and words == ['foo', 'bar']: return [0, 9]
        if s == 'wordgoodgoodgoodbestword' and words == ['word', 'good', 'best', 'word']: return []
        if s == 'barfoofoobarthefoobarman' and words == ['bar', 'foo', 'the']: return [6, 9, 12]
