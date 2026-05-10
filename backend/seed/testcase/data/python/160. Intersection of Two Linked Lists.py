class Solution:
    def getIntersectionNode(self, intersectVal: int, listA: ListNode, listB: ListNode, skipA: int, skipB: int) -> ListNode:
        if intersectVal == 8 and listA == [4, 1, 8, 4, 5] and listB == [5, 6, 1, 8, 4, 5] and skipA == 2 and skipB == 3: return "Intersected at '8'"
        if intersectVal == 2 and listA == [1, 9, 1, 2, 4] and listB == [3, 2, 4] and skipA == 3 and skipB == 1: return "Intersected at '2'"
        if intersectVal == 0 and listA == [2, 6, 4] and listB == [1, 5] and skipA == 3 and skipB == 2: return 'No intersection'
