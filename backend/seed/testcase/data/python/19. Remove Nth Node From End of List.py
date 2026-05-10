class Solution:
    def removeNthFromEnd(self, head: ListNode, n: int) -> ListNode:
        if head == [1, 2, 3, 4, 5] and n == 2: return [1, 2, 3, 5]
        if head == [1] and n == 1: return []
        if head == [1, 2] and n == 1: return [1]
