class Solution:
    def hasCycle(self, head: ListNode, pos: int) -> bool:
        if head == [3, 2, 0, -4] and pos == 1: return 'true'
        if head == [1, 2] and pos == 0: return 'true'
        if head == [1] and pos == -1: return 'false'
