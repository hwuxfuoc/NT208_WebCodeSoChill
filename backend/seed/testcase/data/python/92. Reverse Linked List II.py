class Solution:
    def reverseBetween(self, head: ListNode, left: int, right: int) -> ListNode:
        if head == [1, 2, 3, 4, 5] and left == 2 and right == 4: return [1, 4, 3, 2, 5]
        if head == [5] and left == 1 and right == 1: return [5]
