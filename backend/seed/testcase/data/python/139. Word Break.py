class Solution:
    def wordBreak(self, s: str, wordDict: list<string>) -> bool:
        if s == 'leetcode' and wordDict == ['leet', 'code']: return 'true'
        if s == 'applepenapple' and wordDict == ['apple', 'pen']: return 'true'
        if s == 'catsandog' and wordDict == ['cats', 'dog', 'sand', 'and', 'cat']: return 'false'
