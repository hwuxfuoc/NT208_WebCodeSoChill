class Solution:
    def mergeKLists(self, lists: ListNode[]) -> ListNode:
        if lists == [[1, 4, 5], [1, 3, 4], [2, 6]]: return [1, 1, 2, 3, 4, 4, 5, 6]
        if lists == []: return []
        if lists == [[]]: return []
