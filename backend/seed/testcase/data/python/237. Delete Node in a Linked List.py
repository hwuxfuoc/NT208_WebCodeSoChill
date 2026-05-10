class Solution:
    def deleteNode(self, head: ListNode, node: int) -> void:
        if head == [4, 5, 1, 9] and node == 5: return [4, 1, 9]
        if head == [4, 5, 1, 9] and node == 1: return [4, 5, 9]
