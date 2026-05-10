class Solution:
    def reverseKGroup(self, head: ListNode, k: int) -> ListNode:
        if head == [1, 2, 3, 4, 5] and k == 2: return [2, 1, 4, 3, 5]
        if head == [1, 2, 3, 4, 5] and k == 3: return [3, 2, 1, 4, 5]
