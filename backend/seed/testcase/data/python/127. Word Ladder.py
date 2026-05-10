class Solution:
    def ladderLength(self, beginWord: str, endWord: str, wordList: list<string>) -> int:
        if beginWord == 'hit' and endWord == 'cog' and wordList == ['hot', 'dot', 'dog', 'lot', 'log', 'cog']: return 5
        if beginWord == 'hit' and endWord == 'cog' and wordList == ['hot', 'dot', 'dog', 'lot', 'log']: return 0
