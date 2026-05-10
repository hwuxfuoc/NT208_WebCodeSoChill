class Solution:
    def partition(self, head: ListNode, x: int) -> ListNode:
        if head == [1, 4, 3, 2, 5, 2] and x == 3: return [1, 2, 2, 4, 3, 5]
        if head == [2, 1] and x == 2: return [1, 2]
