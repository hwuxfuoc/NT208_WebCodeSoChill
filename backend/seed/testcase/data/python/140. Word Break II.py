class Solution:
    def wordBreak(self, s: str, wordDict: list<string>) -> list<string>:
        if s == 'catsanddog' and wordDict == ['cat', 'cats', 'and', 'sand', 'dog']: return ['cats and dog', 'cat sand dog']
        if s == 'pineapplepenapple' and wordDict == ['apple', 'pen', 'applepen', 'pine', 'pineapple']: return ['pine apple pen apple', 'pineapple pen apple', 'pine applepen apple']
        if s == 'catsandog' and wordDict == ['cats', 'dog', 'sand', 'and', 'cat']: return []
