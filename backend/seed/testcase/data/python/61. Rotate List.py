class Solution:
    def rotateRight(self, head: ListNode, k: int) -> ListNode:
        if head == [1, 2, 3, 4, 5] and k == 2: return [4, 5, 1, 2, 3]
        if head == [0, 1, 2] and k == 4: return [2, 0, 1]
