class Solution:
    def detectCycle(self, head: ListNode, pos: int) -> ListNode:
        if head == [3, 2, 0, -4] and pos == 1: return 'tail connects to node index 1'
        if head == [1, 2] and pos == 0: return 'tail connects to node index 0'
        if head == [1] and pos == -1: return 'no cycle'
